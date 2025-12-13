import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { BlogPost } from '../types';

import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { SEO } from '../components/SEO';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await db.getPosts();
      // Filter for published posts only in real app, simplified here
      setPosts(data.filter(p => p.status === 'published'));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Icons.Spinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <SEO
        title="Blog | BST Marketing Experts"
        description="Latest marketing strategies, tips, and insights for local businesses."
      />
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h4 className="text-red-500 font-bold uppercase tracking-widest mb-2 text-sm">The Blog</h4>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">The No BS Blog That Will Help You Get More Customers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full">
            <div className="aspect-[16/9] overflow-hidden rounded-xl mb-6 bg-white border border-gray-200">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-xs font-medium mb-3 uppercase tracking-wider">
                <span className="text-primary">{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {post.category && (
                  <>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-gray-500">{post.category}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-primary transition-colors mt-auto">
                Read Article <Icons.ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 text-center border-t border-gray-200 pt-20">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Want these strategies implemented for you?</h3>
        <Link to="/contact" className="inline-block bg-primary hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg uppercase tracking-wider transition-colors">
          Book A Strategy Call
        </Link>
      </div>
    </div>
  );
};