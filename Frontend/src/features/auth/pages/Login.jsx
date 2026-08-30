import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import ThreeBackground from '../../../components/ThreeBackground'

import AppLoadingScreen from '../../../components/AppLoadingScreen'

const Login = () => {
    const { user, loading, handleLogin, handleLogout } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setSubmitting(true)
        try {
            const data = await handleLogin({ email, password })
            if (data?.user) {
                navigate('/')
            } else {
                setErrorMessage('Login failed. Please check your credentials.')
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Invalid email or password.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <AppLoadingScreen 
                badge="⚡ Authenticating"
                subtitle="Checking your session status..."
            />
        )
    }

    if (user) {
        return (
            <main className='auth-page'>
                <ThreeBackground particleCount={60} />
                <div className='auth-card-container' style={{ textAlign: 'center' }}>
                    <div className='auth-brand-header'>
                        <div className='brand-logo'>
                            <span>🎯</span> Hire<span className='brand-accent'>Ready</span>
                        </div>
                    </div>
                    <div style={{ padding: '1rem 0' }}>
                        <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 0.5rem 0' }}>
                            Welcome back, {user.username || user.email}!
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                            You already have an active session.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button className='button primary-button' onClick={() => navigate('/')}>
                            Go to Dashboard &rarr;
                        </button>
                        <button className='button outline-button danger-button' onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className='auth-page'>
            <ThreeBackground particleCount={70} />

            <div className='auth-card-container'>
                {/* Brand Header */}
                <div className='auth-brand-header'>
                    <div className='brand-logo'>
                        <span>🎯</span> Hire<span className='brand-accent'>Ready</span>
                    </div>
                    <p className='brand-subtitle'>Precision interview strategy &amp; roadmap platform</p>
                </div>

                {/* Feature highlights */}
                <div className='feature-pills'>
                    <span className='feature-pill'>✨ Role Match Score</span>
                    <span className='feature-pill'>🗺️ 7-Day Plan</span>
                    <span className='feature-pill'>📄 ATS Resume</span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className='auth-error-alert'>
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='email'>Email Address</label>
                        <div className='input-wrapper'>
                            <span className='input-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </span>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                placeholder='you@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <div className='input-wrapper'>
                            <span className='input-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            </span>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                placeholder='••••••••'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className='button primary-button' type='submit' disabled={submitting} style={{ marginTop: '0.5rem' }}>
                        {submitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p className='auth-switch'>
                    Don't have an account? <Link to='/register'>Create an account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login