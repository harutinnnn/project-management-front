import React, {useState} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {Lock, Mail, ArrowRight, Github, Chrome} from 'lucide-react';
import axios from 'axios';
import {useAuth} from '../hooks/useAuth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const {data} = await axios.post<{ token?: string; user?: { name?: string }; name?: string; userName?: string }>(`${API_BASE}/auth/login`, {
                email,
                password,
            });
            const name = data?.user?.name ?? data?.name ?? data?.userName ?? null;
            login(data?.token, name ?? undefined);
            navigate(from, {replace: true});
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data?.message ??
                    err.response?.data?.error ??
                    err.message ??
                    'Login failed. Please try again.';
                setError(String(message));
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #1e1b4b, #09090b)',
            padding: '2rem'
        }}>
            <div className="glass-panel animate-fade" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '3rem',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, var(--primary-color), #4f46e5)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 30px var(--primary-glow)'
                }}>
                    <Lock size={30} color="white"/>
                </div>

                <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Welcome Back</h1>
                <p style={{color: 'var(--text-muted)', marginBottom: '2.5rem'}}>
                    Please enter your details to sign in.
                </p>

                <form onSubmit={handleSubmit}
                      style={{textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <label style={{fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email
                            Address</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: 'var(--glass-border)',
                            borderRadius: '12px',
                            padding: '0 1rem'
                        }}>
                            <Mail size={18} color="var(--text-muted)"/>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@adin.com"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '1rem',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <label
                            style={{fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)'}}>Password</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: 'var(--glass-border)',
                            borderRadius: '12px',
                            padding: '0 1rem'
                        }}>
                            <Lock size={18} color="var(--text-muted)"/>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '1rem',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '10px',
                            color: '#fca5a5',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            transition: 'all 0.2s ease',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                        {!isLoading && <ArrowRight size={18}/>}
                    </button>
                </form>

                <div style={{margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}/>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>OR CONTINUE WITH</span>
                    <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}/>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <button style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'var(--glass-border)',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}>
                        <Chrome size={18}/>
                        Google
                    </button>
                    <button style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'var(--glass-border)',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}>
                        <Github size={18}/>
                        Github
                    </button>
                </div>

                <p style={{marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none'}}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
