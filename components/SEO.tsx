import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article';
    canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    type = 'website',
    canonical
}) => {
    const location = useLocation();
    const siteUrl = 'https://bstmarketing.me';

    // Construct canonical URL: use provided override or current path
    // Remove trailing slashes and query params for canonical
    const path = location.pathname.endsWith('/') && location.pathname !== '/'
        ? location.pathname.slice(0, -1)
        : location.pathname;

    const currentUrl = canonical || `${siteUrl}${path}`;
    const imageUrl = image || `${siteUrl}/og-image.png`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="BST Marketing" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Helmet>
    );
};
