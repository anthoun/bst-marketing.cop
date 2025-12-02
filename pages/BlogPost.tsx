import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { BlogPost as BlogPostType } from '../types';
import { Icons } from '../components/Icons';

import { Helmet } from 'react-helmet-async';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        try {
          const found = await db.getPostBySlug(slug);
          setPost(found || null);
        } catch (e) {
          console.error("Failed to load post", e);
        }
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="text-primary hover:text-white flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          <Icons.ChevronRight className="w-4 h-4 rotate-180" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20">
      <Helmet>
        <title>{post.seoTitle || post.title} | BST Marketing Experts</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        {post.seoKeywords && <meta name="keywords" content={post.seoKeywords} />}
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-32">
        <Link to="/blog" className="inline-flex items-center text-primary hover:text-white mb-6 font-medium text-xs uppercase tracking-wider bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 transition-colors">
          <Icons.ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Blog
        </Link>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-400 text-sm mb-12">
          <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>5 min read</span>
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-primary prose-strong:text-white text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Footer */}
        <div className="mt-20 p-8 md:p-12 bg-surface border border-white/10 rounded-2xl text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <h3 className="text-2xl font-bold text-white mb-4">Want to implement this strategy?</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Book a free discovery call and we'll map out exactly how to apply this to your business.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg uppercase tracking-wider transition-colors shadow-lg shadow-orange-900/20">
            <Icons.Phone className="w-5 h-5" /> Book A Strategy Call
          </Link>
        </div>
      </div>
    </article>
  );
};
