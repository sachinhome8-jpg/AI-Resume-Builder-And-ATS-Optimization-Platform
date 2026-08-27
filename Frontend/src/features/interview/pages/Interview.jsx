import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, useParams } from 'react-router'
import ScoreGauge from '../components/ScoreGauge.jsx'
import ThreeBackground from '../../../components/ThreeBackground.jsx'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        id: 'roadmap',
        label: '7-Day Study Roadmap',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
        )
    },
]

// ── Question Card Component ──
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(index === 0)
    const [ copied, setCopied ] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        if (navigator.clipboard) {
            navigator.clipboard.writeText(item.answer)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <div className='section-top'>
                            <span className='q-card__tag q-card__tag--intention'>🎯 Interviewer Intention</span>
                        </div>
                        <p>{item.intention}</p>
                    </div>

                    <div className='q-card__section'>
                        <div className='section-top'>
                            <span className='q-card__tag q-card__tag--answer'>💡 Model Answer Framework</span>
                            <button className='copy-btn' onClick={handleCopy}>
                                {copied ? '✓ Copied!' : '📋 Copy Answer'}
                            </button>
                        </div>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap Day Component ──
const RoadMapDay = ({ day }) => {
    const [ completedTasks, setCompletedTasks ] = useState({})

    const toggleTask = (i) => {
        setCompletedTasks(prev => ({ ...prev, [i]: !prev[i] }))
    }

    return (
        <div className='roadmap-day'>
            <div className='roadmap-day__header'>
                <span className='roadmap-day__badge'>Day {day.day}</span>
                <h3 className='roadmap-day__focus'>{day.focus}</h3>
            </div>
            <ul className='roadmap-day__tasks'>
                {day.tasks.map((task, i) => (
                    <li key={i} style={{ textDecoration: completedTasks[i] ? 'line-through' : 'none', opacity: completedTasks[i] ? 0.6 : 1 }}>
                        <input
                            type="checkbox"
                            checked={!!completedTasks[i]}
                            onChange={() => toggleTask(i)}
                        />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ── Main Interview Component ──
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ downloading, setDownloading ] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    const handleDownloadResume = async () => {
        setDownloading(true)
        try {
            await getResumePdf(interviewId)
        } catch (err) {
            console.error("Resume download failed:", err)
            alert(err.message || "Failed to generate resume. Please try again.")
        } finally {
            setDownloading(false)
        }
    }

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <ThreeBackground particleCount={40} />
                <div className='loading-container' style={{ maxWidth: '440px', gap: '1.25rem' }}>
                    <div className='loading-radar'>
                        <div className='radar-ring radar-ring--outer'></div>
                        <div className='radar-ring radar-ring--inner'></div>
                        <div className='radar-core'>
                            <span className='radar-icon'>📋</span>
                        </div>
                    </div>
                    <div className='loading-header'>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Loading Interview Strategy</h2>
                        <p style={{ fontSize: '0.85rem', color: '#8b949e', margin: '4px 0 0 0' }}>Retrieving your questions, insights, and preparation roadmap...</p>
                    </div>
                </div>
            </main>
        )
    }

    const technicalList = report.technicalQuestions || []
    const behavioralList = report.behavioralQuestions || []
    const roadmapList = report.preparationPlan || []
    const skillGaps = report.skillGaps || []

    return (
        <div className='interview-page'>
            <ThreeBackground particleCount={60} />

            <div className='interview-layout'>

                {/* ── Left Navigation ── */}
                <nav className='interview-nav'>
                    <div>
                        <button className='back-btn' onClick={() => navigate('/')}>
                            &larr; Back to Dashboard
                        </button>

                        <p className='interview-nav__label'>Strategy Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div>
                        <button
                            onClick={handleDownloadResume}
                            disabled={downloading}
                            className='resume-download-btn'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            {downloading ? 'Compiling PDF...' : 'Download Resume'}
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    <div className='content-header'>
                        <span className='role-badge'>🎯 Role-Tailored Strategy</span>
                        <h1>{report.title || 'Target Position Plan'}</h1>
                        <p>
                            {activeNav === 'technical' && `Core technical scenarios and architecture questions based on this job's competencies.`}
                            {activeNav === 'behavioral' && `Behavioral questions evaluating leadership, collaboration, and problem-solving framework.`}
                            {activeNav === 'roadmap' && `Structured day-wise study roadmap prioritizing key skills and mock reviews.`}
                        </p>
                    </div>

                    {/* Technical Questions */}
                    {activeNav === 'technical' && (
                        <div className='q-cards-list'>
                            {technicalList.map((item, index) => (
                                <QuestionCard key={index} item={item} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Behavioral Questions */}
                    {activeNav === 'behavioral' && (
                        <div className='q-cards-list'>
                            {behavioralList.map((item, index) => (
                                <QuestionCard key={index} item={item} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Roadmap Timeline */}
                    {activeNav === 'roadmap' && (
                        <div className='roadmap-timeline'>
                            {roadmapList.map((day, index) => (
                                <RoadMapDay key={index} day={day} />
                            ))}
                        </div>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Analytics Sidebar ── */}
                <aside className='interview-analytics'>
                    {/* Match Score */}
                    <div className='analytics-section'>
                        <h3>📊 Profile Alignment</h3>
                        <ScoreGauge score={report.matchScore || 0} size={150} />
                    </div>

                    {/* Skill Gaps */}
                    {skillGaps.length > 0 && (
                        <div className='analytics-section'>
                            <h3>⚡ Identified Skill Gaps</h3>
                            <div className='skill-gaps-list'>
                                {skillGaps.map((gap, i) => {
                                    const sevClass =
                                        gap.severity === 'high' ? 'severity-tag--high' :
                                            gap.severity === 'medium' ? 'severity-tag--medium' :
                                                'severity-tag--low'

                                    return (
                                        <div key={i} className='skill-gap-card'>
                                            <div className='gap-top'>
                                                <span className='skill-name'>{gap.skill}</span>
                                                <span className={`severity-tag ${sevClass}`}>
                                                    {gap.severity}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default Interview