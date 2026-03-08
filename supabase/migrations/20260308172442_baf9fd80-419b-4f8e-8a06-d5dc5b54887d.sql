
-- Create service_images table
CREATE TABLE public.service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view service images
CREATE POLICY "Anyone can view service images"
  ON public.service_images FOR SELECT
  USING (true);

-- Service owners can insert images
CREATE POLICY "Owners can insert service images"
  ON public.service_images FOR INSERT
  TO authenticated
  WITH CHECK (owns_service(service_id));

-- Service owners can delete images
CREATE POLICY "Owners can delete service images"
  ON public.service_images FOR DELETE
  TO authenticated
  USING (owns_service(service_id));

-- Admins can manage all images
CREATE POLICY "Admins can manage service images"
  ON public.service_images FOR ALL
  TO authenticated
  USING (is_admin());

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true);

-- Storage policies: anyone can view
CREATE POLICY "Anyone can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload service images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'service-images');

-- Users can delete their own uploads
CREATE POLICY "Users can delete own service images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'service-images' AND (auth.uid()::text = (storage.foldername(name))[1]));
