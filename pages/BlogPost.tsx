import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { BlogPost as BlogPostType } from '../types';
import { Icons } from '../components/Icons';

import { SEO } from '../components/SEO';
import ReactMarkdown from 'react-markdown';

import { SchemaMarkup } from '../components/SchemaMarkup';

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

          // Fire Meta Pixel ViewContent event
          if (found && typeof window.fbq === 'function') {
            window.fbq('track', 'ViewContent', {
              content_name: found.title,
              content_category: found.category,
              content_ids: [found.id],
              content_type: 'product'
            });
          }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="text-primary hover:text-gray-900 flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          <Icons.ChevronRight className="w-4 h-4 rotate-180" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20">
      <SEO
        title={`${post.seoTitle || post.title} | BST Marketing Experts`}
        description={post.seoDescription || post.excerpt}
        keywords={post.seoKeywords}
        image={post.coverImage}
        type="article"
      />
      <SchemaMarkup
        type="Article"
        data={{
          headline: post.title,
          description: post.seoDescription || post.excerpt,
          image: post.coverImage ? [post.coverImage] : ["https://bstmarketing.me/og-image.png"],
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          author: {
            "@type": "Person",
            "name": "BST Marketing"
          },
          publisher: {
            "@type": "Organization",
            "name": "BST Marketing",
            "logo": {
              "@type": "ImageObject",
              "url": "https://bstmarketing.me/favicon.png"
            }
          }
        }}
      />

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-32">
        <Link to="/blog" className="inline-flex items-center text-primary hover:text-gray-900 mb-6 font-medium text-xs uppercase tracking-wider bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-200 transition-colors">
          <Icons.ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Blog
        </Link>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight drop-shadow-sm">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600 text-sm mb-16">
          <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full" />
          <span>5 min read</span>
        </div>

        <div className="prose prose-lg md:prose-xl lg:prose-2xl max-w-none 
          prose-headings:font-black prose-headings:text-gray-900 prose-headings:mb-8 prose-headings:mt-16
          prose-p:text-gray-700 prose-p:text-lg md:prose-p:text-xl prose-p:leading-loose prose-p:mb-8 prose-p:tracking-wide
          prose-a:text-primary prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-gray-900 hover:prose-a:decoration-gray-900 transition-colors
          prose-strong:text-gray-900 prose-strong:font-black
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-li:mb-4 prose-li:text-gray-700 prose-li:text-lg
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:text-xl
          prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-gray-200 prose-img:my-12">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* CTA Footer */}
        <div className="mt-20 p-8 md:p-12 bg-white border border-gray-200 rounded-2xl text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to implement this strategy?</h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
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
