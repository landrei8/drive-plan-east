
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- EV Stations table
CREATE TABLE public.ev_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  connector_types TEXT[] DEFAULT '{}',
  power_kw NUMERIC,
  network TEXT,
  country TEXT NOT NULL CHECK (country IN ('Romania', 'Moldova', 'Bulgaria')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved stations" ON public.ev_stations FOR SELECT USING (status = 'approved');
CREATE POLICY "Auth users can submit stations" ON public.ev_stations FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can view own submissions" ON public.ev_stations FOR SELECT TO authenticated USING (auth.uid() = submitted_by);
CREATE POLICY "Admins can view all stations" ON public.ev_stations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update stations" ON public.ev_stations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Gas stations table
CREATE TABLE public.gas_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Romania', 'Moldova', 'Bulgaria')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gas_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gas stations" ON public.gas_stations FOR SELECT USING (true);
CREATE POLICY "Admins can manage gas stations" ON public.gas_stations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fuel prices table
CREATE TABLE public.fuel_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.gas_stations(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline_95', 'gasoline_98', 'diesel', 'lpg')),
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view fuel prices" ON public.fuel_prices FOR SELECT USING (true);
CREATE POLICY "Auth users can report prices" ON public.fuel_prices FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by);

-- EV charging prices
CREATE TABLE public.ev_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.ev_stations(id) ON DELETE CASCADE,
  charge_type TEXT NOT NULL CHECK (charge_type IN ('ac', 'dc_fast', 'dc_ultra')),
  price_per_kwh NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ev prices" ON public.ev_prices FOR SELECT USING (true);

-- Favorite stations
CREATE TABLE public.favorite_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  station_type TEXT NOT NULL CHECK (station_type IN ('gas', 'ev')),
  station_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, station_type, station_id)
);

ALTER TABLE public.favorite_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.favorite_stations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorite_stations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorite_stations FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ev_stations_updated_at BEFORE UPDATE ON public.ev_stations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gas_stations_updated_at BEFORE UPDATE ON public.gas_stations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
