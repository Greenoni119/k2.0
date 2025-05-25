-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories
CREATE POLICY "Allow public read access" ON categories
    FOR SELECT USING (true);

-- Only allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some initial categories
INSERT INTO categories (name, description, slug, image_url) VALUES
('Pants', 'Comfortable and stylish pants', 'pants', 'https://example.com/pants.jpg'),
('Shirts', 'Casual and formal shirts', 'shirts', 'https://example.com/shirts.jpg'),
('Accessories', 'Complete your look', 'accessories', 'https://example.com/accessories.jpg')
ON CONFLICT (slug) DO NOTHING;
