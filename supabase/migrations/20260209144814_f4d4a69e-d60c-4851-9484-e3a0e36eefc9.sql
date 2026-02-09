
-- =============================================
-- FIX: Change ALL RESTRICTIVE policies to PERMISSIVE
-- RESTRICTIVE = AND logic (all must pass) — WRONG for our use case
-- PERMISSIVE = OR logic (any one must pass) — CORRECT
-- =============================================

-- ==================== CATEGORIES ====================
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (is_admin());

-- ==================== COMPANIES ====================
DROP POLICY IF EXISTS "Anyone can view active companies" ON public.companies;
DROP POLICY IF EXISTS "Owners can view their own companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Providers can create companies" ON public.companies;
DROP POLICY IF EXISTS "Owners can update their companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can update all companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can delete companies" ON public.companies;

CREATE POLICY "Anyone can view active companies"
  ON public.companies FOR SELECT
  USING (status = 'active');

CREATE POLICY "Owners can view their own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all companies"
  ON public.companies FOR SELECT
  USING (is_admin());

CREATE POLICY "Providers can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id AND (is_provider() OR is_admin()));

CREATE POLICY "Owners can update their companies"
  ON public.companies FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update all companies"
  ON public.companies FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete companies"
  ON public.companies FOR DELETE
  USING (is_admin());

-- ==================== SERVICES ====================
DROP POLICY IF EXISTS "Anyone can view approved services" ON public.services;
DROP POLICY IF EXISTS "Owners can view their own services" ON public.services;
DROP POLICY IF EXISTS "Admins can view all services" ON public.services;
DROP POLICY IF EXISTS "Providers can create services for their companies" ON public.services;
DROP POLICY IF EXISTS "Owners can update their services" ON public.services;
DROP POLICY IF EXISTS "Admins can update all services" ON public.services;
DROP POLICY IF EXISTS "Owners can delete their services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete all services" ON public.services;

CREATE POLICY "Anyone can view approved services"
  ON public.services FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Owners can view their own services"
  ON public.services FOR SELECT
  USING (owns_service(id));

CREATE POLICY "Admins can view all services"
  ON public.services FOR SELECT
  USING (is_admin());

CREATE POLICY "Providers can create services for their companies"
  ON public.services FOR INSERT
  WITH CHECK (owns_company(company_id));

CREATE POLICY "Owners can update their services"
  ON public.services FOR UPDATE
  USING (owns_service(id));

CREATE POLICY "Admins can update all services"
  ON public.services FOR UPDATE
  USING (is_admin());

CREATE POLICY "Owners can delete their services"
  ON public.services FOR DELETE
  USING (owns_service(id));

CREATE POLICY "Admins can delete all services"
  ON public.services FOR DELETE
  USING (is_admin());

-- ==================== INQUIRIES ====================
DROP POLICY IF EXISTS "Anyone can submit inquiries with valid data" ON public.inquiries;
DROP POLICY IF EXISTS "Service owners can view inquiries for their services" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Service owners can update inquiry status" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can manage all inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit inquiries with valid data"
  ON public.inquiries FOR INSERT
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    email IS NOT NULL AND email <> '' AND
    message IS NOT NULL AND message <> ''
  );

CREATE POLICY "Service owners can view inquiries for their services"
  ON public.inquiries FOR SELECT
  USING (owns_service(service_id));

CREATE POLICY "Admins can view all inquiries"
  ON public.inquiries FOR SELECT
  USING (is_admin());

CREATE POLICY "Service owners can update inquiry status"
  ON public.inquiries FOR UPDATE
  USING (owns_service(service_id));

CREATE POLICY "Admins can manage all inquiries"
  ON public.inquiries FOR ALL
  USING (is_admin());

-- ==================== PROFILES ====================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==================== USER_ROLES ====================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (is_admin());
