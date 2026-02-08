-- Update handle_new_user to assign the role selected during registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _requested_role text;
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email
    );
    
    -- Get the requested role from user metadata, default to 'user'
    _requested_role := COALESCE(NEW.raw_user_meta_data->>'requested_role', 'user');
    
    -- Assign the requested role (only 'user' or 'provider' allowed from signup)
    IF _requested_role = 'provider' THEN
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'provider');
    ELSE
        INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
    END IF;
    
    RETURN NEW;
END;
$function$;
