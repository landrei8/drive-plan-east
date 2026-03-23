import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useStations, Station } from '@/hooks/use-stations';
import { Fuel, Zap, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet icon not appearing in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Leaflet icon property access
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const createCustomIcon = (type: 'gas' | 'ev') => {
  const color = type === 'gas' ? '#f59e0b' : '#22c55e';
  const iconMarkup = renderToStaticMarkup(
    <div style={{
      backgroundColor: color,
      padding: '8px',
      borderRadius: '12px',
      border: '2px solid white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {type === 'gas' ? <Fuel size={16} color="white" /> : <Zap size={16} color="white" />}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

const gasIcon = createCustomIcon('gas');
const evIcon = createCustomIcon('ev');

const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const Map = ({ filter = 'all' }: { filter?: 'all' | 'gas' | 'ev' }) => {
  const { data: stations, isLoading } = useStations();

  const filteredStations = stations?.filter(s => 
    filter === 'all' || s.type === filter
  );

  return (
    <MapContainer 
      center={[45.9432, 24.9668]} 
      zoom={7} 
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />

      {filteredStations?.map((station) => (
        <Marker 
          key={station.id} 
          position={[station.latitude, station.longitude]}
          icon={station.type === 'gas' ? gasIcon : evIcon}
        >
          <Popup className="station-popup">
            <div className="p-1">
              <h3 className="font-bold text-foreground text-base mb-1">{station.brand || station.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {station.address}
              </p>
              
              <div className="space-y-2">
                {station.type === 'gas' ? (
                  station.prices.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center bg-secondary/30 p-2 rounded-lg">
                      <span className="text-xs font-medium uppercase">{p.fuel_type.replace('_', ' ')}</span>
                      <span className="font-bold text-primary">{p.price} {p.currency}/L</span>
                    </div>
                  ))
                ) : (
                  station.prices.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center bg-secondary/30 p-2 rounded-lg">
                      <span className="text-xs font-medium uppercase">{p.charge_type.replace('_', ' ')}</span>
                      <span className="font-bold text-primary">{p.price_per_kwh} {p.currency}/kWh</span>
                    </div>
                  ))
                )}
                {station.prices.length === 0 && (
                  <p className="text-xs italic text-muted-foreground">No prices reported yet</p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
