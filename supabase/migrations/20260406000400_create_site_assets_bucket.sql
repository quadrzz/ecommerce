-- Create dedicated bucket for site assets (logo, hero images, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read on site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload on site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets');

-- Allow authenticated users to update/delete their uploads
CREATE POLICY "Authenticated update on site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated delete on site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets');
