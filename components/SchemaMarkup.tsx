import React from 'react';
import { Helmet } from 'react-helmet-async';

type SchemaType = 'Organization' | 'Article' | 'LocalBusiness';

interface SchemaProps {
    type: SchemaType;
    data: Record<string, any>;
}

export const SchemaMarkup: React.FC<SchemaProps> = ({ type, data }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
};
