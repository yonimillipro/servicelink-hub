
CREATE OR REPLACE FUNCTION public.search_services(
  search_query text DEFAULT NULL,
  search_location text DEFAULT NULL,
  filter_category_id uuid DEFAULT NULL,
  filter_status text DEFAULT 'approved',
  filter_featured boolean DEFAULT NULL,
  filter_company_id uuid DEFAULT NULL,
  result_limit integer DEFAULT 12,
  result_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  price numeric,
  price_type text,
  location text,
  image text,
  status text,
  is_featured boolean,
  category_id uuid,
  company_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  category_name text,
  category_slug text,
  company_name text,
  company_logo_url text,
  company_location text,
  company_verified boolean,
  total_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH matched AS (
    SELECT
      s.id,
      s.title,
      s.description,
      s.price,
      s.price_type,
      s.location,
      s.image,
      s.status,
      s.is_featured,
      s.category_id,
      s.company_id,
      s.created_at,
      s.updated_at,
      c.name AS category_name,
      c.slug AS category_slug,
      co.name AS company_name,
      co.logo_url AS company_logo_url,
      co.location AS company_location,
      co.verified AS company_verified
    FROM services s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN companies co ON s.company_id = co.id
    WHERE
      (filter_status IS NULL OR s.status = filter_status)
      AND (filter_category_id IS NULL OR s.category_id = filter_category_id)
      AND (filter_featured IS NULL OR s.is_featured = filter_featured)
      AND (filter_company_id IS NULL OR s.company_id = filter_company_id)
      AND (
        search_query IS NULL
        OR s.title ILIKE '%' || search_query || '%'
        OR s.description ILIKE '%' || search_query || '%'
        OR co.name ILIKE '%' || search_query || '%'
        OR c.name ILIKE '%' || search_query || '%'
      )
      AND (
        search_location IS NULL
        OR s.location ILIKE '%' || search_location || '%'
        OR co.location ILIKE '%' || search_location || '%'
      )
    ORDER BY s.is_featured DESC NULLS LAST, s.created_at DESC
  )
  SELECT
    matched.*,
    COUNT(*) OVER () AS total_count
  FROM matched
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;
