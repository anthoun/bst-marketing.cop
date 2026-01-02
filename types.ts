export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  coverImage?: string;
  publishedAt: string;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  type: 'newsletter' | 'contact';
  message?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
}

export enum PageView {
  HOME = 'HOME',
  BLOG_INDEX = 'BLOG_INDEX',
  BLOG_POST = 'BLOG_POST',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

declare global {
  interface Window {
    fbq: (action: string, eventName: string, params?: object) => void;
  }
}