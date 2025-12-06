import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Icons } from '../components/Icons';

export const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-20 relative overflow-hidden">
            <Helmet>
                <title>404 - Page Not Found | BST Marketing Experts</title>
                <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 p-6 bg-primary/10 rounded-full animate-pulse-slow">
                    <Icons.Search className="w-16 h-16 text-primary" strokeWidth={2} />
                </div>

                <h1 className="text-8xl font-black text-gray-900 mb-2">404</h1>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                    Oops! Page Not Found
                </h2>

                <p className="text-gray-600 max-w-md mb-10 text-lg leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    to="/"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-500/20 flex items-center gap-2 group"
                >
                    <Icons.ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};
