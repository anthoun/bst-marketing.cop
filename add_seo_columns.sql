-- Run this SQL in your Supabase SQL Editor to add SEO columns to the posts table

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
