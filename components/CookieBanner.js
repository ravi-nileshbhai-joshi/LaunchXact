'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner only if consent has not been previously given
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '550px',
            background: 'rgba(15, 15, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            borderRadius: '1rem',
            padding: '1.5rem',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'cookieSlideUp 0.5s ease-out forwards'
        }}>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes cookieSlideUp {
                    from { transform: translate(-55%, 50px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}} />
            
            <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '600' }}>
                    Cookie & Privacy Preference
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                    We use necessary session cookies for security and authentication, and anonymous cookies for conversion analytics (Google Tag Manager) to improve our visibility platform.
                </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                    onClick={() => setIsVisible(false)} 
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#94a3b8',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                >
                    Dismiss
                </button>
                <button 
                    onClick={acceptCookies} 
                    style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.2s'
                    }}
                >
                    Accept Cookies
                </button>
            </div>
        </div>
    );
}
