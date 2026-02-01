-- =============================================================================
-- ServiceLink MVP Database Schema
-- =============================================================================

-- 1. Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'provider', 'user');

-- 2. Create user_roles table (CRITICAL: roles must be separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    service_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2),
    price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'starting_from', 'negotiable')),
    location TEXT,
    image TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Create inquiries table
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- Security Definer Functions (avoid RLS recursion)
-- =============================================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Check if current user is provider
CREATE OR REPLACE FUNCTION public.is_provider()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'provider')
$$;

-- Check if user owns a company
CREATE OR REPLACE FUNCTION public.owns_company(_company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.companies
        WHERE id = _company_id
          AND owner_id = auth.uid()
    )
$$;

-- Check if user owns a service (via company)
CREATE OR REPLACE FUNCTION public.owns_service(_service_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.services s
        JOIN public.companies c ON s.company_id = c.id
        WHERE s.id = _service_id
          AND c.owner_id = auth.uid()
    )
$$;

-- =============================================================================
-- Enable RLS on all tables
-- =============================================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies: user_roles
-- =============================================================================

CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.is_admin());

-- =============================================================================
-- RLS Policies: profiles
-- =============================================================================

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =============================================================================
-- RLS Policies: categories (public read, admin manage)
-- =============================================================================

CREATE POLICY "Anyone can view categories"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
    ON public.categories FOR DELETE
    USING (public.is_admin());

-- =============================================================================
-- RLS Policies: companies
-- =============================================================================

CREATE POLICY "Anyone can view active companies"
    ON public.companies FOR SELECT
    USING (status = 'active');

CREATE POLICY "Owners can view their own companies"
    ON public.companies FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all companies"
    ON public.companies FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Providers can create companies"
    ON public.companies FOR INSERT
    WITH CHECK (auth.uid() = owner_id AND (public.is_provider() OR public.is_admin()));

CREATE POLICY "Owners can update their companies"
    ON public.companies FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update all companies"
    ON public.companies FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete companies"
    ON public.companies FOR DELETE
    USING (public.is_admin());

-- =============================================================================
-- RLS Policies: services
-- =============================================================================

CREATE POLICY "Anyone can view approved services"
    ON public.services FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Owners can view their own services"
    ON public.services FOR SELECT
    USING (public.owns_service(id));

CREATE POLICY "Admins can view all services"
    ON public.services FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Providers can create services for their companies"
    ON public.services FOR INSERT
    WITH CHECK (public.owns_company(company_id));

CREATE POLICY "Owners can update their services"
    ON public.services FOR UPDATE
    USING (public.owns_service(id));

CREATE POLICY "Admins can update all services"
    ON public.services FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Owners can delete their services"
    ON public.services FOR DELETE
    USING (public.owns_service(id));

CREATE POLICY "Admins can delete all services"
    ON public.services FOR DELETE
    USING (public.is_admin());

-- =============================================================================
-- RLS Policies: inquiries
-- =============================================================================

CREATE POLICY "Anyone can create inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service owners can view inquiries for their services"
    ON public.inquiries FOR SELECT
    USING (public.owns_service(service_id));

CREATE POLICY "Admins can view all inquiries"
    ON public.inquiries FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Service owners can update inquiry status"
    ON public.inquiries FOR UPDATE
    USING (public.owns_service(service_id));

CREATE POLICY "Admins can manage all inquiries"
    ON public.inquiries FOR ALL
    USING (public.is_admin());

-- =============================================================================
-- Triggers for automatic timestamps
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- Trigger: Auto-create profile on user signup
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email
    );
    
    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Seed initial categories
-- =============================================================================

INSERT INTO public.categories (name, slug, description, icon) VALUES
    ('Home Services', 'home-services', 'Plumbing, electrical, cleaning, repairs', 'Home'),
    ('IT & Software', 'it-software', 'Web development, mobile apps, IT support', 'Code'),
    ('Creative Services', 'creative-services', 'Graphic design, photography, video editing', 'Palette'),
    ('Education & Training', 'education-training', 'Tutoring, courses, workshops', 'GraduationCap'),
    ('Business Services', 'business-services', 'Consulting, accounting, legal services', 'Briefcase'),
    ('Health & Wellness', 'health-wellness', 'Fitness, therapy, healthcare services', 'Heart'),
    ('Events & Entertainment', 'events-entertainment', 'Event planning, DJs, catering', 'PartyPopper'),
    ('Transportation', 'transportation', 'Delivery, logistics, moving services', 'Truck');