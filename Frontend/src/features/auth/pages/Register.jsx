import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import ThreeBackground from '../../../components/ThreeBackground'

import AppLoadingScreen from '../../../components/AppLoadingScreen'

const Register = () => {
    const navigate = useNavigate()
    const { user, loading, handleRegister, handleLogout } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setSubmitting(true)
        try {
            const data = await handleRegister({ username, email, password })
            if (data?.user) {
                navigate('/')
            } else {
                setErrorMessage('Registration failed. Please try again.')
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Registration failed. Please check details.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <AppLoadingScreen 
                badge="⚡ Initializing"
                subtitle="Preparing registration workspace..."
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
                            Welcome, {user.username || user.email}!
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
                    <p className='brand-subtitle'>Create your free account to build interview roadmaps</p>
                </div>

                {/* Feature highlights */}
                <div className='feature-pills'>
                    <span className='feature-pill'>🚀 Fast Setup</span>
                    <span className='feature-pill'>🧠 Deep Analysis</span>
                    <span className='feature-pill'>📈 Tailored Strategy</span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className='auth-error-alert'>
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='username'>Full Name or Username</label>
                        <div className='input-wrapper'>
                            <span className='input-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <input
                                id='username'
                                name='username'
                                type='text'
                                placeholder='Jane Doe'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder='Create a secure password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className='button primary-button' type='submit' disabled={submitting} style={{ marginTop: '0.5rem' }}>
                        {submitting ? 'Creating Account...' : 'Get Started Free'}
                    </button>
                </form>

                <p className='auth-switch'>
                    Already have an account? <Link to='/login'>Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register