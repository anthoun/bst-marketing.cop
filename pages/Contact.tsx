import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { db } from '../services/db';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await db.saveLead({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        type: 'contact'
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <SEO
        title="Contact | BST Marketing Experts"
        description="Book a free discovery call with BST Marketing Experts."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left Content */}
        <div className="pt-4">
          <h4 className="text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-4">Discovery Call</h4>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1]">
            Let's Map Out Your<br />
            <span className="text-primary">Dominance Strategy</span>
          </h1>

          <p className="text-gray-600 text-lg mb-12 leading-relaxed max-w-lg">
            This isn't a sales pitch disguised as a call. We'll look at your current setup, identify the bottlenecks, and show you exactly how we can add 20-30 new customers next month.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Icons.Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">30 Minutes</h3>
                <p className="text-gray-600 text-sm">Short, punchy, and valuable.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Icons.Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Zoom Meeting</h3>
                <p className="text-gray-600 text-sm">Face to face strategy session.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Icons.Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Actionable Plan</h3>
                <p className="text-gray-600 text-sm">Walk away with a roadmap, whether you hire us or not.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">What's your biggest challenge?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4"
            >
              {status === 'loading' ? (
                <Icons.Spinner className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                <>Request Sent <Icons.Check className="w-5 h-5" /></>
              ) : (
                <><Icons.Send className="w-4 h-4" /> Request Call</>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};