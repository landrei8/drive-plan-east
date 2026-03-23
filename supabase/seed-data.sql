-- Romania - Bucharest
INSERT INTO public.gas_stations (name, brand, address, latitude, longitude, country)
VALUES 
('Petrom Virtutii', 'Petrom', 'Soseaua Virtutii 14, București', 44.4355, 26.0355, 'Romania'),
('OMV Pipera', 'OMV', 'Bulevardul Pipera 1, Voluntari', 44.4811, 26.1122, 'Romania'),
('Rompetrol Mihai Bravu', 'Rompetrol', 'Soseaua Mihai Bravu 420, București', 44.4155, 26.1255, 'Romania');

-- Fuel prices for Romania
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'gasoline_95', 7.12, 'RON' FROM public.gas_stations WHERE name = 'Petrom Virtutii';
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'diesel', 7.25, 'RON' FROM public.gas_stations WHERE name = 'Petrom Virtutii';

INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'gasoline_98', 7.95, 'RON' FROM public.gas_stations WHERE name = 'OMV Pipera';
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'diesel', 7.35, 'RON' FROM public.gas_stations WHERE name = 'OMV Pipera';

-- Bulgaria - Sofia
INSERT INTO public.gas_stations (name, brand, address, latitude, longitude, country)
VALUES 
('Shell Sofia Center', 'Shell', 'bul. "Knyaz Aleksandar Dondukov" 2, Sofia', 42.6977, 23.3219, 'Bulgaria'),
('EKO Bulgaria', 'EKO', 'bul. "Bulgaria" 102, Sofia', 42.6644, 23.2872, 'Bulgaria');

-- Fuel prices for Bulgaria
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'gasoline_95', 2.65, 'BGN' FROM public.gas_stations WHERE name = 'Shell Sofia Center';
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'diesel', 2.72, 'BGN' FROM public.gas_stations WHERE name = 'Shell Sofia Center';

-- Moldova - Chisinau
INSERT INTO public.gas_stations (name, brand, address, latitude, longitude, country)
VALUES 
('Lukoil Chisinau', 'Lukoil', 'Strada Mihai Viteazul 1, Chișinău', 47.0311, 28.8211, 'Moldova'),
('Petrom Moldova Center', 'Petrom', 'Bulevardul Ștefan cel Mare și Sfânt, Chișinău', 47.0244, 28.8322, 'Moldova');

-- Fuel prices for Moldova
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'gasoline_95', 24.85, 'MDL' FROM public.gas_stations WHERE name = 'Lukoil Chisinau';
INSERT INTO public.fuel_prices (station_id, fuel_type, price, currency)
SELECT id, 'diesel', 21.40, 'MDL' FROM public.gas_stations WHERE name = 'Lukoil Chisinau';

-- EV Stations
INSERT INTO public.ev_stations (name, address, latitude, longitude, network, country, status)
VALUES 
('Tesla Supercharger Bucharest', 'Calea Floreasca 246, București', 44.4788, 26.1055, 'Tesla', 'Romania', 'approved'),
('Enel X Way Sofia', 'bul. "Vitosha" 1, Sofia', 42.6955, 23.3200, 'Enel X', 'Bulgaria', 'approved'),
('EV Point Chisinau', 'Strada Albișoara 4, Chișinău', 47.0355, 28.8400, 'EV Point', 'Moldova', 'approved');

-- EV Prices
INSERT INTO public.ev_prices (station_id, charge_type, price_per_kwh, currency)
SELECT id, 'dc_ultra', 2.85, 'RON' FROM public.ev_stations WHERE name = 'Tesla Supercharger Bucharest';
INSERT INTO public.ev_prices (station_id, charge_type, price_per_kwh, currency)
SELECT id, 'dc_fast', 0.95, 'BGN' FROM public.ev_stations WHERE name = 'Enel X Way Sofia';
INSERT INTO public.ev_prices (station_id, charge_type, price_per_kwh, currency)
SELECT id, 'ac', 6.50, 'MDL' FROM public.ev_stations WHERE name = 'EV Point Chisinau';
