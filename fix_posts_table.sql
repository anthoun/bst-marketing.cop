-- Add missing columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS cover_image TEXT;
