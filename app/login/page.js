'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '@/app/waiting-list-full.module.css';
import Link from 'next/link';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [useMagicLink, setUseMagicLink] = useState(false);
    const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'

    const handleGoogleLogin = async () => {
        try {
            setAuthStatus('submitting');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/startup-visibility-os/success?session_id=mock_google_session`
                }
            });
            if (error) throw error;
        } catch (e) {
            console.error('Google Auth Error:', e);
            alert(e.message);
            setAuthStatus('idle');
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setAuthStatus('submitting');

        try {
            if (useMagicLink) {
                // Passwordless Magic Link Sign In
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/startup-visibility-os/success?session_id=mock_magic_link`
                    }
                });
                if (error) throw error;
                setAuthStatus('success');
                alert('Magic Link Sent! Check your email inbox to log in.');
            } else {
                if (isSignUp) {
                    // Standard Sign Up
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            emailRedirectTo: `${window.location.origin}/startup-visibility-os/success?session_id=mock_signup`
                        }
                    });
                    if (error) throw error;
                    setAuthStatus('success');
                    alert('Registration successful! Please check your email to confirm your account.');
                } else {
                    // Standard Sign In
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    if (error) throw error;
                    // Redirect to success page or home
                    window.location.href = `/startup-visibility-os/success?session_id=mock_login_session`;
                }
            }
        } catch (e) {
            console.error('Email Auth Error:', e);
            alert(e.message);
            setAuthStatus('idle');
        }
    };

    return (
        <div className={styles.page} style={{ paddingTop: '8rem', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
            <div className={styles.container} style={{ maxWidth: '480px' }}>
                
                {/* Back Link */}
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
                </Link>

                <div className="glass-panel" style={{
                    padding: '2.5rem',
                    background: 'rgba(20, 20, 20, 0.65)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1.25rem',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                            {useMagicLink ? 'Login with Magic Link' : isSignUp ? 'Create your Account' : 'Welcome Back'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Access your Startup Visibility OS dashboard and purchases.
                        </p>
                    </div>

                    {/* Google OAuth Button */}
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={authStatus === 'submitting'}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            padding: '0.8rem',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '1.5rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                        <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '1.1rem', color: '#ea4335' }} />
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                        <span>OR EMAIL</span>
                        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                    </div>

                    <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Email Input */}
                        <div style={{ position: 'relative' }}>
                            <FontAwesomeIcon icon={faEnvelope} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="email"
                                placeholder="Your Email Address"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                                    borderRadius: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Password Input (Only when not using magic link) */}
                        {!useMagicLink && (
                            <div style={{ position: 'relative' }}>
                                <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="password"
                                    placeholder="Your Password"
                                    required={!useMagicLink}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.75rem',
                                        borderRadius: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={authStatus === 'submitting'}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                            }}
                        >
                            {authStatus === 'submitting' ? 'Please Wait...' : useMagicLink ? 'Send Magic Link' : isSignUp ? 'Sign Up' : 'Sign In'}
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </form>

                    {/* Toggle Links */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        {/* Toggle sign in / sign up */}
                        {!useMagicLink && (
                            <button 
                                onClick={() => setIsSignUp(!isSignUp)}
                                style={{ background: 'transparent', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontWeight: '500' }}
                            >
                                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                            </button>
                        )}

                        {/* Toggle Magic Link / Password */}
                        <button 
                            onClick={() => {
                                setUseMagicLink(!useMagicLink);
                                setIsSignUp(false);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}
                        >
                            {useMagicLink ? 'Use Password instead' : 'Use passwordless Magic Link'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
