'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';

function RouteScrollReset({ lenisRef }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If URL contains a hash, scroll smoothly to that element
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const timer = setTimeout(() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -80, immediate: false });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
        return () => clearTimeout(timer);
      }
    }

    // Immediately reset scroll position to the top of the new page
    const resetScrollToTop = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScrollToTop();
    const rafId = requestAnimationFrame(resetScrollToTop);
    const timeoutId = setTimeout(resetScrollToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams, lenisRef]);

  return null;
}

export default function SmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Prevent browser from restoring scroll to the previous page's position
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      autoToggle: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: (node) => {
        if (!node || typeof node.hasAttribute !== 'function') return false;
        return (
          node.hasAttribute('data-lenis-prevent') ||
          Boolean(node.closest?.('[data-lenis-prevent]')) ||
          Boolean(node.closest?.('[role="dialog"]')) ||
          Boolean(node.closest?.('[class*="paywallOverlay"]')) ||
          Boolean(node.closest?.('[class*="paywallModal"]')) ||
          Boolean(node.closest?.('[class*="modal"]'))
        );
      },
    });

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
      window.lenis = lenis;
    }

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Global listener for internal links to cancel inertia or scroll to top on same page
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external or new-window links
      if (
        anchor.target === '_blank' ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      // Stop any running inertia so the outgoing page doesn't fling into the new one
      lenis.stop();
      requestAnimationFrame(() => {
        lenis.start();
      });

      // If clicking a link to the current page without a hash, scroll smoothly to top
      const [path] = href.split('#');
      const currentPath = window.location.pathname;
      if (path === currentPath && !href.includes('#')) {
        lenis.scrollTo(0, { immediate: false });
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete window.__lenis;
        delete window.lenis;
      }
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <RouteScrollReset lenisRef={lenisRef} />
    </Suspense>
  );
}
