/**
 * Page Transitions Logic - Ultra Minimalist
 * Handles only the background fade-out to ensure a seamless handoff 
 * to the next page's splash screen.
 */

(function () {
    "use strict";

    const EXCLUDE_SELECTORS = [
        '[href^="#"]',
        '[href^="mailto:"]',
        '[href^="tel:"]',
        '[target="_blank"]',
        '.no-transition'
    ];

    function initTransitions() {
        if (!document.querySelector('.page-transition-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }

        const overlay = document.querySelector('.page-transition-overlay');

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            const isExcluded = EXCLUDE_SELECTORS.some(selector => link.matches(selector));
            if (isExcluded) return;

            try {
                const url = new URL(link.href, window.location.origin);
                if (url.origin !== window.location.origin) return;
            } catch (err) {
                return;
            }

            // Start Fade
            e.preventDefault();
            overlay.classList.add('active');

            setTimeout(() => {
                window.location.href = href;
            }, 450); // Slightly faster to feel snappier
        });

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                overlay.classList.remove('active');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransitions);
    } else {
        initTransitions();
    }
})();
