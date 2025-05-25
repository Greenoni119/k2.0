-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    size_type TEXT NOT NULL DEFAULT 'pants',
    available_sizes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- Only allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to product images
CREATE POLICY "Allow public access to product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Allow authenticated users to upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to update their uploaded product images
CREATE POLICY "Allow authenticated users to update product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
