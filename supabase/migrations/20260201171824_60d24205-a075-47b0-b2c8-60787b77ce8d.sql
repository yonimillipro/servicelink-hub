-- Fix: Restrict inquiry creation to require valid data
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;

-- Create a more restrictive policy - anyone can create but must provide required fields
-- The table constraints will enforce data validity, this is acceptable for a contact form
CREATE POLICY "Anyone can submit inquiries with valid data"
    ON public.inquiries FOR INSERT
    WITH CHECK (
        name IS NOT NULL 
        AND name != '' 
        AND email IS NOT NULL 
        AND email != '' 
        AND message IS NOT NULL 
        AND message != ''
    );