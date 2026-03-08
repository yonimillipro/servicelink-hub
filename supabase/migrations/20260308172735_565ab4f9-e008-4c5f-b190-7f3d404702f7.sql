
CREATE TABLE public.saved_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, service_id)
);

ALTER TABLE public.saved_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved services"
  ON public.saved_services FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save services"
  ON public.saved_services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave services"
  ON public.saved_services FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
