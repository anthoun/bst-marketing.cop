import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { db } from '../services/db';
import { SEO } from '../components/SEO';

export const GMB: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        website: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            // Combine fields into message for storage
            const messageContent = `GMB Audit Request
Company: ${formData.companyName}
Website: ${formData.website}
Name: ${formData.firstName} ${formData.lastName}`;

            await db.saveLead({
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                message: messageContent,
                type: 'contact' // Using 'contact' to ensure DB compatibility
            });

            // Fire Meta Pixel Lead event
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', { content_name: 'GMB Audit' });
            }

            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', phone: '', companyName: '', website: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Scroll to form function
    const scrollToForm = () => {
        document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Free GMB Audit | BST Marketing Experts"
                description="Get a free analysis of your Google Business Profile. We'll tell you 3 things you can fix right now to rank higher."
            />

            {/* Hero Section */}
            <section className="bg-surface border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-primary/10 text-primary">
                        <Icons.Zap className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1]">
                        Free Analysis: 3 Things To Easily Change So Your Business <span className="text-primary">Ranks Higher In Google</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        We'll audit your Google Business Profile free of charge with no strings attached and tell you 3 things you can do right now to stop being invisible.
                    </p>

                    <button
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/25 text-lg"
                    >
                        Get Free Advice Now <Icons.ArrowDown className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Form Section */}
            <section id="audit-form" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-2xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Free Fixes</h2>
                            <p className="text-gray-600">Fill out the form below to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        First name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Last name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 mt-4">Company Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Website <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                            required
                                            placeholder="https://"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 leading-relaxed pt-2">
                                By clicking "Submit" you agree to receive marketing communications from BST Marketing via email, phone, and/or SMS. You can unsubscribe at any time by clicking the unsubscribe link in our emails or by contacting us.
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-orange-500/25"
                            >
                                {status === 'loading' ? (
                                    <Icons.Spinner className="w-5 h-5 animate-spin" />
                                ) : status === 'success' ? (
                                    <>Success! We'll be in touch. <Icons.Check className="w-5 h-5" /></>
                                ) : (
                                    <>Submit <Icons.Send className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
