import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { db } from '../services/db';
import { SEO } from '../components/SEO';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await db.saveLead({ email, type: 'newsletter' });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-20">
      <SEO
        title="Newsletter | BST Marketing Experts"
        description="Join our newsletter for weekly marketing tips and strategies."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border border-red-200 mb-8">
            <Icons.Mail className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900">
            The <span className="text-primary">Unfair Advantage</span><br />
            Newsletter
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join local business owners receiving weekly direct response strategies that are working <span className="italic text-gray-900">right now</span>. No BS, just things that will get results straight away.
          </p>
        </div>

        {/* Subscription Form */}
        <div className="max-w-xl mx-auto mb-20">
          <div className="bg-white border border-gray-200 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 shadow-lg">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 px-6 py-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={handleSubscribe}
              disabled={status === 'loading' || status === 'success'}
              className="bg-primary hover:bg-red-600 text-white font-bold px-8 py-4 md:py-0 rounded-xl md:rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-wider text-sm"
            >
              {status === 'loading' ? (
                <Icons.Spinner className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                <>Subscribed <Icons.Check className="w-5 h-5" /></>
              ) : (
                <>Subscribe Free <Icons.ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">
            Unsubscribe at any time. We hate spam as much as you do.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Case Studies",
              desc: "Real breakdowns of campaigns that generated 10x ROI."
            },
            {
              title: "Swipe Files",
              desc: "Copy-paste headlines and ad scripts you can use today."
            },
            {
              title: "Market Trends",
              desc: "What's changing in the algo and how to profit from it."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-primary/30 transition-colors shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};