
-- Fix: Allow users to view their own inquiries
CREATE POLICY "Users can view their own inquiries"
ON public.inquiries
FOR SELECT
USING (auth.uid() = user_id);
