-- 1. Cria o bucket para as fotos dos clientes (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-uploads', 'customer-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permite que QUALQUER PESSOA (anônima) veja as imagens desse bucket
CREATE POLICY "Anyone can view customer-uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'customer-uploads');

-- 3. Permite que QUALQUER PESSOA (anônima) faça upload de imagens nesse bucket
CREATE POLICY "Anyone can upload to customer-uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'customer-uploads');
