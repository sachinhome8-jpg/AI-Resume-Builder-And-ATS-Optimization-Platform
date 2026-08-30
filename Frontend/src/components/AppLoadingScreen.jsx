import React, { useState, useEffect } from 'react'
import './AppLoadingScreen.scss'
import ThreeBackground from './ThreeBackground'

const DEFAULT_STEPS = [
    { label: 'Connecting to HireReady Cloud...', sub: 'Establishing secure TLS connection' },
    { label: 'Authenticating Session Security...', sub: 'Validating cryptographic tokens' },
    { label: 'Initializing AI Intelligence Models...', sub: 'Preparing tailored strategy engine' },
    { label: 'Calibrating Workspace & Career Data...', sub: 'Optimizing ATS benchmarking matrix' }
]

const FEATURE_PILLS = [
    { icon: '🎯', label: 'Precision Interview Readiness' },
    { icon: '⚡', label: '99.4% ATS Match Engine' },
    { icon: '🛡️', label: 'End-to-End Encrypted' },
    { icon: '📊', label: 'Live Strategy Synthesis' }
]

const AppLoadingScreen = ({
    title = "HireReady AI Workspace",
    badge = "⚡ System Initializing",
    message,
    subtitle
}) => {
    const [stepIndex, setStepIndex] = useState(0)
    const [progress, setProgress] = useState(15)
    const [isColdStart, setIsColdStart] = useState(false)

    useEffect(() => {
        // Smooth simulated progress
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 92) return 92
                const delta = prev < 50 ? 5 : prev < 75 ? 3 : 1
                return prev + delta
            })
        }, 350)

        // Rotate status messages smoothly
        const stepTimer = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % DEFAULT_STEPS.length)
        }, 2200)

        // If backend takes longer (e.g. Render / free hosting cold start), show reassurance
        const coldStartTimer = setTimeout(() => {
            setIsColdStart(true)
        }, 3800)

        return () => {
            clearInterval(progressTimer)
            clearInterval(stepTimer)
            clearTimeout(coldStartTimer)
        }
    }, [])

    const activeStep = DEFAULT_STEPS[stepIndex]

    return (
        <main className="app-loader-page" role="status" aria-live="polite">
            <ThreeBackground particleCount={65} />

            {/* Ambient Background Glows */}
            <div className="ambient-glow ambient-glow--top"></div>
            <div className="ambient-glow ambient-glow--bottom"></div>

            <div className="app-loader-card">
                {/* Glowing Radar & Hologram Core */}
                <div className="loader-cyber-radar">
                    <div className="radar-orbit radar-orbit--outer"></div>
                    <div className="radar-orbit radar-orbit--middle"></div>
                    <div className="radar-orbit radar-orbit--inner"></div>
                    <div className="radar-scanner"></div>
                    <div className="radar-hologram-core">
                        <span className="radar-brand-symbol">🎯</span>
                        <div className="core-pulse-wave"></div>
                    </div>
                </div>

                {/* Brand & Badge Header */}
                <div className="loader-brand-section">
                    <div className="loader-badge">
                        <span className="pulse-dot"></span>
                        <span>{badge}</span>
                    </div>

                    <h1 className="loader-title">
                        Hire<span className="highlight-text">Ready</span>
                    </h1>

                    <p className="loader-subtitle">
                        {subtitle || "Building your AI-powered interview strategy & resume optimization platform"}
                    </p>
                </div>

                {/* Animated Scanner Progress Bar */}
                <div className="loader-progress-wrapper">
                    <div className="progress-info">
                        <div className="status-indicator-wrap">
                            <span className="status-sparkle">✨</span>
                            <span className="status-text-live">
                                {message || activeStep.label}
                            </span>
                        </div>
                        <span className="progress-percentage-num">{progress}%</span>
                    </div>

                    <div className="progress-track-bg">
                        <div
                            className="progress-fill-bar"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="laser-beam"></div>
                        </div>
                    </div>

                    <span className="progress-sub-caption">
                        {activeStep.sub}
                    </span>
                </div>

                {/* Cold Start / Waking Up Notice if delayed */}
                {isColdStart && (
                    <div className="cold-start-banner animate-fade-in">
                        <span className="coffee-icon">☕</span>
                        <div className="cold-start-content">
                            <strong>Spinning up cloud server...</strong>
                            <p>Free-tier backend instances may take a few seconds to wake up from idle. Thank you for your patience!</p>
                        </div>
                    </div>
                )}

                {/* Feature highlight tags */}
                <div className="loader-feature-tags">
                    {FEATURE_PILLS.map((pill, idx) => (
                        <div key={idx} className="feature-pill-chip">
                            <span>{pill.icon}</span>
                            <span>{pill.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default AppLoadingScreen
