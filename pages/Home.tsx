import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { db } from '../services/db';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const faqs = [
    {
      question: "How fast can I expect results?",
      answer: "Our direct response campaigns usually start generating clicks and leads within 48-72 hours of launch. Optimization takes a few weeks to reach peak efficiency."
    },
    {
      question: "Do I need a large budget to start?",
      answer: "No. We believe in testing small and scaling what works. We can start with a conservative budget to validate the offer before pouring gas on the fire."
    },
    {
      question: "What industries do you work with?",
      answer: "We specialize in local service businesses and high-ticket offers where ROI is clear. If you sell a solid product or service, we can sell it."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No. We operate on performance and results. We earn your business every single month."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      <Helmet>
        <title>Get more clients | BST Marketing Experts</title>
        <meta name="description" content="We help local businesses get more clients with paid ads and SEO. Guaranteed results in 30 days." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 pb-20 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="flex flex-col items-start text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900">
                We'll Fill Your Calendar with New Customers in 30 Days - <span className="text-primary">Guaranteed</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed">
                Stop waiting for customers to find you. We put your business in front of locals actively searching for your services - starting this month.
              </p>

              <Link to="/contact" className="px-8 py-4 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                Book a Call <Icons.ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Content - Visual/Video */}
            <div className="relative">
              {/* Decorative border/glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30"></div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white group">
                {/* Overlay for lazy load effect simulation */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors z-10 pointer-events-none">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                {/* Digital Network Abstract Image Background for Video Thumbnail */}
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                  alt="Digital Network"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                <iframe
                  className="w-full h-full relative z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  src="https://www.youtube.com/embed/KR_NykRkqnk?autoplay=0&mute=1&controls=0&showinfo=0&rel=0"
                  title="Agency Showreel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Services</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-gray-900">
            How We Can Help You <span className="text-primary">Grow</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Icons.Search,
              title: "Ads To Get To The Top Of Google",
              desc: "Show up immediately when locals search for exactly what you offer. We capture high-intent traffic ready to buy."
            },
            {
              icon: Icons.Share,
              title: "FB/IG Ads To Reach EVERY Local Client",
              desc: "Be everywhere. Google, Instagram, Facebook, YouTube. We follow your prospects until they convert."
            },
            {
              icon: Icons.MapPin,
              title: "Reach Number 1 On Google For Free",
              desc: "Be the #1 on Google Maps organically. Dominate local SEO so you own the \"Map Pack\" in your city."
            },
          ].map((service, i) => (
            <div key={i} className="p-8 md:p-10 rounded-2xl bg-white border border-gray-200 hover:border-primary/30 transition-all duration-300 group flex flex-col items-center text-center shadow-sm hover:shadow-md">
              <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(242,78,30,0.3)] transition-all">
                <service.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase leading-tight tracking-wide">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process / How We Work Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">How We Work</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-gray-900">It's Straightforward</h2>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[3.75rem] left-0 w-full h-px bg-gray-200 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-10">
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-xl group-hover:border-primary/30 transition-colors">
                  <Icons.Clipboard className="w-10 h-10 text-primary opacity-80" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-red-600 border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-wide text-gray-900">Plan Your Success</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                We figure out who your customers are and what they want to hear before we start.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-10">
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-xl group-hover:border-primary/30 transition-colors">
                  <Icons.Settings className="w-10 h-10 text-primary opacity-80" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-orange-500 border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-wide text-gray-900">Handle Everything Daily</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                We create ads, schedule them, and manage all your campaigns so you don't have to.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-10">
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-xl group-hover:border-primary/30 transition-colors">
                  <Icons.TrendingUp className="w-10 h-10 text-primary opacity-80" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-yellow-500 border-4 border-white flex items-center justify-center text-black font-bold text-sm shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-wide text-gray-900">Track What Works</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                We see which posts bring in customers and do more of what's working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">The Difference</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-gray-900">
            Why Choose BST Marketing Over <br className="hidden md:block" /> Everyone Else?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Other Agencies Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12">
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-wider mb-8 text-center pb-8 border-b border-gray-200">
              Other Agencies
            </h3>
            <ul className="space-y-6">
              {[
                "Generic content templates",
                "Monthly reporting only",
                "Separate teams for different platforms",
                "Long-term contracts required",
                "One-size-fits-all approach"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="min-w-[24px] w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                    <Icons.X className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-gray-500 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BST Marketing Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Top Gradient Border/Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-yellow-500"></div>
            <div className="absolute top-0 inset-x-0 h-20 bg-primary/5 blur-xl"></div>

            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider mb-8 text-center pb-8 border-b border-gray-100 relative z-10">
              BST <span className="text-primary">Marketing</span>
            </h3>
            <ul className="space-y-6 relative z-10">
              {[
                "If it doesn't work, we refund you",
                "Start small and see if we're a good fit",
                "Facebook, Instagram, Google, we cover it all",
                "Stay flexible - no long-term commitments",
                "Regular calls to review what's working"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="min-w-[24px] w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Icons.Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-gray-900 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Questions</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                onClick={() => toggleFaq(index)}
                className={`rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer ${isOpen
                  ? 'bg-white border-primary shadow-[0_0_15px_rgba(242,78,30,0.1)]'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className={`font-bold text-lg select-none ${isOpen ? 'text-gray-900' : 'text-gray-600'}`}>
                    {faq.question}
                  </h3>
                  <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                      <Icons.Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Icons.Plus className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Get Started Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 group">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 px-8 py-16 md:py-20 text-center flex flex-col items-center">
            <h4 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">Get Started</h4>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] max-w-2xl">
              Your Customer flood starts right here.
            </h2>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Book a free 30 min call and we'll show you exactly how we'll fill your calendar with new customers.
            </p>

            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#F24E1E] to-[#d63a0e] hover:from-[#d63a0e] hover:to-[#b9320c] text-white font-bold px-8 py-5 rounded-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-900/20 flex items-center gap-3 uppercase tracking-wider text-sm md:text-base"
            >
              <Icons.Phone className="w-5 h-5 fill-current" />
              Book A Free Call
            </Link>

            <p className="mt-8 text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">
              No Obligation. No Pressure. Just Strategy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};