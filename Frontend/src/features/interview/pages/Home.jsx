import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'
import LoadingRoadmap from '../components/LoadingRoadmap.jsx'
import ThreeBackground from '../../../components/ThreeBackground.jsx'

const SAMPLE_JOB = `Role: Senior Full Stack Software Engineer (React & Node.js)
Company: TechNova Solutions
Requirements:
- 4+ years of professional experience with React.js, TypeScript, and modern state management.
- Strong backend experience with Node.js, Express, MongoDB, and REST / GraphQL APIs.
- Deep understanding of system design, scalable web architectures, caching (Redis), and microservices.
- Solid experience with unit testing (Jest/Vitest), CI/CD pipelines, and cloud services (AWS/GCP).
- Excellent communication and ability to mentor junior engineers.`

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                setSelectedFile(file)
                setErrorMessage('')
            } else {
                setErrorMessage('Please select a valid PDF file.')
            }
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                setSelectedFile(file)
                setErrorMessage('')
            } else {
                setErrorMessage('Please drop a valid PDF file.')
            }
        }
    }

    const handleRemoveFile = (e) => {
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ''
        }
    }

    const handleFillSample = () => {
        setJobDescription(SAMPLE_JOB)
        if (!selfDescription) {
            setSelfDescription('Full Stack Developer with 4 years of experience building modern React and Node.js applications with MongoDB and AWS.')
        }
        setErrorMessage('')
    }

    const handleGenerateReport = async () => {
        setErrorMessage('')
        if (!jobDescription || !jobDescription.trim()) {
            setErrorMessage('Please enter a Target Job Description.')
            return
        }

        if (!selectedFile && (!selfDescription || !selfDescription.trim())) {
            setErrorMessage('Please upload your Resume (PDF) or provide a Quick Self-Description.')
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile: selectedFile
            })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || err.message || 'Failed to generate report. Please try again.')
        }
    }

    if (loading) {
        return <LoadingRoadmap />
    }

    return (
        <div className='home-page'>
            <ThreeBackground particleCount={80} />

            {/* Top Navigation Bar */}
            <nav className='home-navbar'>
                <a href='/' className='nav-brand'>
                    <span className='brand-icon'>🎯</span>
                    <span>Hire<span className='brand-accent'>Ready</span></span>
                </a>

                <div className='nav-actions'>
                    {user && (
                        <div className='user-chip'>
                            <span className='user-dot'></span>
                            <span>{user.username || user.email}</span>
                        </div>
                    )}
                    <button className='logout-btn' onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </nav>

            {/* Page Hero Header */}
            <header className='page-header'>
                <span className='hero-badge'>🚀 Precision Interview Readiness</span>
                <h1>
                    Build Your Custom <span className='highlight'>Interview Strategy</span>
                </h1>
                <p>
                    Benchmark your exact experience against target job requirements to generate tailored technical scenarios, behavioral strategies, and a 7-day study roadmap.
                </p>
            </header>

            {/* Error Banner */}
            {errorMessage && (
                <div style={{
                    maxWidth: '1080px',
                    width: '100%',
                    margin: '0 auto 1.5rem auto',
                    padding: '12px 20px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '12px',
                    color: '#fca5a5',
                    fontWeight: 600,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10,
                    backdropFilter: 'blur(10px)'
                }}>
                    ⚠️ {errorMessage}
                </div>
            )}

            {/* Main Interactive Glass Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <div className='panel-title-wrap'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                            </div>
                            <span className='badge--required'>Required</span>
                        </div>

                        <p className='panel__hint'>
                            Paste the job requirements, responsibilities, or role description.
                        </p>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste job description here...\ne.g. 'Looking for a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, and distributed system design...'`}
                            maxLength={5000}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                type='button'
                                onClick={handleFillSample}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ff2d78',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                ✨ Fill Sample Job Posting
                            </button>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                {jobDescription.length} / 5000 chars
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile & Resume */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <div className='panel-title-wrap'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Experience &amp; Profile</h2>
                            </div>
                            <span className='badge--best'>Recommended</span>
                        </div>

                        {/* Dropzone */}
                        <label
                            className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
                            htmlFor='resume'
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <span className='dropzone__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                            </span>
                            {selectedFile ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p className='dropzone__title' style={{ color: '#34d399' }}>
                                        ✓ {selectedFile.name}
                                    </p>
                                    <p className='dropzone__subtitle'>
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull;{' '}
                                        <span
                                            onClick={handleRemoveFile}
                                            style={{ color: '#f87171', cursor: 'pointer', textDecoration: 'underline' }}>
                                            Remove
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className='dropzone__title'>Upload Your Resume (PDF)</p>
                                    <p className='dropzone__subtitle'>Drag &amp; drop or click to browse &bull; Max 10MB</p>
                                </>
                            )}
                            <input
                                ref={resumeInputRef}
                                hidden
                                type='file'
                                id='resume'
                                name='resume'
                                accept='.pdf'
                                onChange={handleFileChange}
                            />
                        </label>

                        {/* OR Divider */}
                        <div className='or-divider'>
                            <span>OR QUICK PROFILE</span>
                        </div>

                        {/* Quick Self Description */}
                        <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            id='selfDescription'
                            name='selfDescription'
                            className='panel__textarea panel__textarea--short'
                            placeholder="Briefly describe your years of experience, stack, and primary roles if you don't have a resume PDF ready..."
                        />

                        <div className='info-box'>
                            <span className='info-icon'>💡</span>
                            <p>Either an uploaded <strong>Resume PDF</strong> or a <strong>Quick Self-Description</strong> provides the data needed to evaluate your role fit.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>
                        <span>⚡</span> Smart Strategy Synthesis &bull; Approx 20-30s
                    </span>
                    <button onClick={handleGenerateReport} className='generate-btn'>
                        <span>🎯</span> Generate My Interview Strategy &rarr;
                    </button>
                </div>
            </div>

            {/* Recent Reports Section */}
            {reports && reports.length > 0 && (
                <section className='recent-reports'>
                    <div className='recent-header'>
                        <h2>Your Generated Strategies</h2>
                        <span>{reports.length} Saved {reports.length === 1 ? 'Plan' : 'Plans'}</span>
                    </div>

                    <div className='reports-grid'>
                        {reports.map((report) => {
                            const scoreClass =
                                report.matchScore >= 80 ? 'score-pill--high' :
                                    report.matchScore >= 60 ? 'score-pill--mid' :
                                        'score-pill--low'

                            return (
                                <div
                                    key={report._id}
                                    className='report-card'
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='card-top'>
                                        <h3>{report.title || 'Custom Position Strategy'}</h3>
                                        <span className={`score-pill ${scoreClass}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                    <div className='card-bottom'>
                                        <span>📅 {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className='view-link'>View Strategy &rarr;</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>HireReady Platform</a>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms &amp; Conditions</a>
                <a href='#'>Support</a>
            </footer>
        </div>
    )
}

export default Home