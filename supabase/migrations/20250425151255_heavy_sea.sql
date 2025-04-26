/*
  # Booking System Schema

  1. New Tables
    - `services`: Stores service information
      - id: uuid (primary key)
      - name: text
      - description: text
      - duration: integer (minutes)
      - price: integer (cents)
      - image_url: text
      - stripe_price_id: text
      - created_at: timestamptz
      - updated_at: timestamptz

    - `appointments`: Stores appointment information
      - id: uuid (primary key)
      - customer_name: text
      - customer_email: text
      - customer_phone: text
      - service_id: uuid (references services)
      - date: date
      - time: time
      - status: appointment_status
      - payment_status: text
      - session_id: text
      - created_at: timestamptz
      - updated_at: timestamptz

  2. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users
*/

-- Create appointment status enum
CREATE TYPE appointment_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed'
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration integer NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  stripe_price_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  service_id uuid REFERENCES services(id) NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, time, service_id)
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read services" ON services
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to read their appointments" ON appointments
  FOR SELECT TO authenticated
  USING (customer_email = auth.jwt()->>'email');

CREATE POLICY "Allow authenticated users to create appointments" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_appointments_date_time ON appointments(date, time);
CREATE INDEX idx_appointments_customer_email ON appointments(customer_email);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();