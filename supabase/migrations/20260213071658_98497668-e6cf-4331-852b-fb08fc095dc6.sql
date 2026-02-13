
-- Drop index first, then move extension
DROP INDEX IF EXISTS idx_services_location_trgm;
DROP EXTENSION IF EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Recreate the index using the extensions schema
CREATE INDEX IF NOT EXISTS idx_services_location_trgm 
ON public.services 
USING GIN (location extensions.gin_trgm_ops);
