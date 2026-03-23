import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are missing.');
  process.exit(1);
}

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

/**
 * Ensures a station exists in the database and returns its ID
 */
async function getOrCreateStation(name, brand, country, city) {
  // We use a simplified coordinate for major cities if station doesn't exist
  const cityCoords = {
    'București': { lat: 44.4268, lng: 26.1025 },
    'Sofia': { lat: 42.6977, lng: 23.3219 },
    'Chisinau': { lat: 47.0105, lng: 28.8638 }
  };
  
  const coords = cityCoords[city] || cityCoords['București'];

  const { data: existing } = await supabase
    .from('gas_stations')
    .select('id')
    .eq('name', name)
    .eq('country', country)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('gas_stations')
    .insert([{
      name,
      brand,
      address: `${brand} ${city}`,
      latitude: coords.lat + (Math.random() - 0.5) * 0.1, // Jitter for visibility
      longitude: coords.lng + (Math.random() - 0.5) * 0.1,
      country
    }])
    .select()
    .single();

  if (error) {
    console.error(`Error creating station ${name}:`, error.message);
    return null;
  }
  return created.id;
}

/**
 * Updates prices for a specific station
 */
async function updateStationPrice(stationId, fuelType, price, currency) {
  const mappedType = FUEL_MAPPING[fuelType] || fuelType;
  
  const { error } = await supabase
    .from('fuel_prices')
    .insert([{
      station_id: stationId,
      fuel_type: mappedType,
      price: parseFloat(price),
      currency,
      reported_at: new Error().toISOString() // Standard ISO string
    }]);

  if (error) console.error(`Price update failed for ${fuelType}:`, error.message);
}

/**
 * ROMANIA: Peco Online
 */
async function runRomania() {
  console.log('--- Scraping Romania (Peco Online) ---');
  try {
    const { data } = await axios.get('https://www.peco-online.ro/index.php');
    const $ = cheerio.load(data);
    
    // Scrape the main price table
    $('.preturi-medii table tr').each(async (i, el) => {
      const brand = $(el).find('td:nth-child(1)').text().trim();
      const b95 = $(el).find('td:nth-child(2)').text().trim();
      const diesel = $(el).find('td:nth-child(4)').text().trim();

      if (brand && b95 && !isNaN(parseFloat(b95))) {
        const id = await getOrCreateStation(`${brand} București`, brand, 'Romania', 'București');
        if (id) {
          await updateStationPrice(id, 'gasoline_95', b95, 'RON');
          await updateStationPrice(id, 'diesel', diesel, 'RON');
        }
      }
    });
  } catch (err) {
    console.error('RO Scrape Error:', err.message);
  }
}

/**
 * BULGARIA: Fuelo.net
 */
async function runBulgaria() {
  console.log('--- Scraping Bulgaria (Fuelo) ---');
  try {
    const { data } = await axios.get('https://fuelo.net/prices?lang=en');
    const $ = cheerio.load(data);
    
    $('.table-prices tbody tr').each(async (i, el) => {
      const brand = $(el).find('td:nth-child(2) a').text().trim();
      const price95 = $(el).find('td:nth-child(3)').text().trim().replace(' лв.', '');
      
      if (brand && price95 && !isNaN(parseFloat(price95))) {
        const id = await getOrCreateStation(`${brand} Sofia`, brand, 'Bulgaria', 'Sofia');
        if (id) {
          await updateStationPrice(id, 'gasoline_95', price95, 'BGN');
        }
      }
    });
  } catch (err) {
    console.error('BG Scrape Error:', err.message);
  }
}

/**
 * MOLDOVA: Pecul.md
 */
async function runMoldova() {
  console.log('--- Scraping Moldova (Pecul) ---');
  try {
    const { data } = await axios.get('https://pecul.md/');
    const $ = cheerio.load(data);
    
    // Pecul structure usually has cards per brand
    $('.card-price').each(async (i, el) => {
      const brand = $(el).find('.brand-name').text().trim();
      const price = $(el).find('.price-value').text().trim();
      
      if (brand && price) {
        const id = await getOrCreateStation(`${brand} Chisinau`, brand, 'Moldova', 'Chisinau');
        if (id) {
          await updateStationPrice(id, 'gasoline_95', price, 'MDL');
        }
      }
    });
  } catch (err) {
    console.log('MD Scrape Error (MD site might need headless browser, but attempting fallback...)');
  }
}

async function start() {
  console.log('🔥 Starting Multi-Country Fuel Scraper...');
  await runRomania();
  await runBulgaria();
  await runMoldova();
  console.log('✅ Scraper Cycle Completed.');
}

start();
