import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Vercel serverless function (Node.js)
export default async function handler(req, res) {
  // 1. Basic security check for CRON jobs
  // Vercel sets a specific header for cron jobs
  const isCron = req.headers['x-vercel-cron'] === '1';
  // Allow manual runs during testing via a secret key if needed, or just allow for now
  // if (!isCron && req.query.key !== process.env.SCRAPER_KEY) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  console.log('--- Triggering Scraper CRON Job ---');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const FUEL_MAPPING = {
    'Benzina 95': 'gasoline_95',
    'Benzina 98': 'gasoline_98',
    'Motorina': 'diesel',
    'GPL': 'lpg',
    'A-95': 'gasoline_95',
    'Diesel': 'diesel',
    'LPG': 'lpg'
  };

  async function getOrCreateStation(name, brand, country, city) {
    const cityCoords = {
      'București': { lat: 44.4268, lng: 26.1025 },
      'Sofia': { lat: 42.6977, lng: 23.3219 },
      'Chisinau': { lat: 47.0105, lng: 28.8638 }
    };
    const coords = cityCoords[city] || cityCoords['București'];
    const { data: existing } = await supabase.from('gas_stations').select('id').eq('name', name).eq('country', country).single();
    if (existing) return existing.id;
    const { data: created } = await supabase.from('gas_stations').insert([{ name, brand, address: `${brand} ${city}`, latitude: coords.lat + (Math.random() - 0.5) * 0.1, longitude: coords.lng + (Math.random() - 0.5) * 0.1, country }]).select().single();
    return created?.id;
  }

  async function updateStationPrice(stationId, fuelType, price, currency) {
    const mappedType = FUEL_MAPPING[fuelType] || fuelType;
    await supabase.from('fuel_prices').insert([{ station_id: stationId, fuel_type: mappedType, price: parseFloat(price), currency, reported_at: new Date().toISOString() }]);
  }

  try {
    // ROMANIA (Peco Online)
    const { data: roData } = await axios.get('https://www.peco-online.ro/index.php');
    const $ro = cheerio.load(roData);
    const roPromises = [];
    $ro('.preturi-medii table tr').each((i, el) => {
      const brand = $ro(el).find('td:nth-child(1)').text().trim();
      const b95 = $ro(el).find('td:nth-child(2)').text().trim();
      const diesel = $ro(el).find('td:nth-child(4)').text().trim();
      if (brand && b95 && !isNaN(parseFloat(b95))) {
        roPromises.push((async () => {
          const id = await getOrCreateStation(`${brand} București`, brand, 'Romania', 'București');
          if (id) {
            await updateStationPrice(id, 'gasoline_95', b95, 'RON');
            await updateStationPrice(id, 'diesel', diesel, 'RON');
          }
        })());
      }
    });

    // BULGARIA (Fuelo)
    const { data: bgData } = await axios.get('https://fuelo.net/prices?lang=en');
    const $bg = cheerio.load(bgData);
    const bgPromises = [];
    $bg('.table-prices tbody tr').each((i, el) => {
      const brand = $bg(el).find('td:nth-child(2) a').text().trim();
      const price95 = $bg(el).find('td:nth-child(3)').text().trim().replace(' лв.', '');
      if (brand && price95 && !isNaN(parseFloat(price95))) {
        bgPromises.push((async () => {
          const id = await getOrCreateStation(`${brand} Sofia`, brand, 'Bulgaria', 'Sofia');
          if (id) await updateStationPrice(id, 'gasoline_95', price95, 'BGN');
        })());
      }
    });

    await Promise.all([...roPromises, ...bgPromises]);

    return res.status(200).json({ success: true, message: 'Prices updated successfully' });
  } catch (err) {
    console.error('CRON Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
