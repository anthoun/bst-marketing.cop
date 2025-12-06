import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Disable browser's default scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Immediate scroll
        window.scrollTo(0, 0);
        document.body.scrollTo(0, 0);

        // Delayed scroll to handle any async rendering or layout shifts
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
