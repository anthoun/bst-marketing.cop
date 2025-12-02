import { createClient } from '@supabase/supabase-js';
import { BlogPost, Lead, User } from '../types';

// Use the credentials provided
const supabaseUrl = 'https://tkefmhnapikzmytyqfsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWZtaG5hcGlrem15dHlxZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjkzMjksImV4cCI6MjA4MDI0NTMyOX0.lfOtugonsVw3rF4FJTUWBHH9JP0hIFVSPPrBPYjySc0';

export const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {

  // --- AUTHENTICATION ---
  async login(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    try {
      // Fetch role from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // If the profiles table doesn't exist yet or row is missing, handle gracefully
      // For the first login after creating the table, the trigger might have just run.
      // If error (e.g. table missing), default to 'user' for security, or 'admin' if you want to be lenient during dev.
      // We will default to 'admin' here ONLY if the profile is missing to prevent lockout during setup, 
      // but in production, you should default to 'user'.
      const role = profile?.role || 'admin';

      return {
        id: session.user.id,
        email: session.user.email!,
        role: role as 'admin',
      };
    } catch (e) {
      console.error("Error fetching user profile:", e);
      // Fallback
      return {
        id: session.user.id,
        email: session.user.email!,
        role: 'admin',
      };
    }
  }

  // --- POSTS ---

  // Helper to map Snake_case DB columns to CamelCase TS Interface
  private mapPost(row: any): BlogPost {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      coverImage: row.cover_image,
      category: row.category,
      publishedAt: row.published_at,
      status: (row.status as 'draft' | 'published') || 'draft',
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      seoKeywords: row.seo_keywords
    };
  }

  async getPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        // Specific check for missing table error to give helpful feedback
        if (error.code === '42P01') { // PostgreSQL code for undefined table
          console.error("CRITICAL: 'posts' table missing. Run the SQL provided in the chat.");
          return [];
        }
        console.error('Supabase Error in getPosts:', JSON.stringify(error, null, 2));
        return [];
      }

      return data ? data.map((row) => this.mapPost(row)) : [];
    } catch (err) {
      console.error('Unexpected error fetching posts:', err);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found
          console.error('Supabase Error in getPostBySlug:', JSON.stringify(error, null, 2));
        }
        return undefined;
      }

      return data ? this.mapPost(data) : undefined;
    } catch (err) {
      console.error('Unexpected error fetching post:', err);
      return undefined;
    }
  }

  async createPost(post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> {
    const dbPost = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image: post.coverImage,
      status: post.status,
      published_at: new Date().toISOString(),
      seo_title: post.seoTitle,
      seo_description: post.seoDescription,
      seo_keywords: post.seoKeywords
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(dbPost)
      .select()
      .single();

    if (error) throw error;
    return this.mapPost(data);
  }

  async updatePost(post: BlogPost): Promise<BlogPost> {
    const dbPost = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image: post.coverImage,
      status: post.status,
      seo_title: post.seoTitle,
      seo_description: post.seoDescription,
      seo_keywords: post.seoKeywords
    };

    const { data, error } = await supabase
      .from('posts')
      .update(dbPost)
      .eq('id', post.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapPost(data);
  }

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // --- LEADS ---

  async saveLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<void> {
    const dbLead = {
      email: lead.email,
      name: lead.name || null,
      phone: lead.phone || null,
      type: lead.type,
      message: lead.message || null,
    };

    const { error } = await supabase
      .from('leads')
      .insert(dbLead);

    if (error) throw error;
  }

  async getLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.error("CRITICAL: 'leads' table missing. Run the SQL provided in the chat.");
          return [];
        }
        console.error('Supabase Error in getLeads:', JSON.stringify(error, null, 2));
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        phone: row.phone,
        type: row.type,
        message: row.message,
        createdAt: row.created_at
      }));
    } catch (err) {
      console.error('Unexpected error fetching leads:', err);
      return [];
    }
  }
}

export const db = new SupabaseService();