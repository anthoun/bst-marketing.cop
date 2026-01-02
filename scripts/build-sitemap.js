import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://tkefmhnapikzmytyqfsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWZtaG5hcGlrem15dHlxZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjkzMjksImV4cCI6MjA4MDI0NTMyOX0.lfOtugonsVw3rF4FJTUWBHH9JP0hIFVSPPrBPYjySc0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    console.log('Generating sitemap...');

    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('slug, published_at')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            process.exit(1);
        }

        const baseUrl = 'https://bstmarketing.me';

        // Static pages
        const staticPages = [
            '',
            '/blog',
            '/newsletter',
            '/contact'
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(path => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${encodeURIComponent(post.slug)}</loc>
    <lastmod>${new Date(post.published_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

        const publicDir = path.resolve(__dirname, '../public');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

        console.log('Sitemap generated successfully at public/sitemap.xml');
    } catch (e) {
        console.error('Exception:', e);
        process.exit(1);
    }
}

generateSitemap();
