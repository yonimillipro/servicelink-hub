
-- Fix services SELECT policies: change from RESTRICTIVE to PERMISSIVE
DROP POLICY "Anyone can view approved services" ON public.services;
DROP POLICY "Owners can view their own services" ON public.services;
DROP POLICY "Admins can view all services" ON public.services;

CREATE POLICY "Anyone can view approved services"
  ON public.services FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Owners can view their own services"
  ON public.services FOR SELECT
  USING (owns_service(id));

CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  USING (is_admin());

-- Fix categories SELECT policy
DROP POLICY "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- Fix companies SELECT policies
DROP POLICY "Anyone can view active companies" ON public.companies;
DROP POLICY "Owners can view their own companies" ON public.companies;
DROP POLICY "Admins can view all companies" ON public.companies;

CREATE POLICY "Anyone can view active companies"
  ON public.companies FOR SELECT
  USING (status = 'active');

CREATE POLICY "Owners can view their own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all companies"
  ON public.companies FOR SELECT
  USING (is_admin());
