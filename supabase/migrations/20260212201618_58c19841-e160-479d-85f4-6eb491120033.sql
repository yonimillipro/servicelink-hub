
-- Enable pg_trgm extension for location ILIKE performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram index on location
CREATE INDEX IF NOT EXISTS idx_services_location_trgm 
ON services 
USING GIN (location gin_trgm_ops);
