import React, { useState, useEffect } from 'react'

const STEPS = [
    {
        title: 'Parsing Resume & Profile Signals',
        desc: 'Extracting key technical skills, experience depth, and project highlights.'
    },
    {
        title: 'Analyzing Target Job Requirements',
        desc: 'Identifying core competencies, stack priorities, and recruiter expectations.'
    },
    {
        title: 'Calculating Role Match & Skill Gaps',
        desc: 'Benchmarking your background against job expectations with precision.'
    },
    {
        title: 'Synthesizing Questions & Daily Roadmap',
        desc: 'Crafting tailored technical questions, behavioral scenarios, and a structured study plan.'
    }
]

const TIPS = [
    '💡 Pro-Tip: Structure your behavioral answers using the STAR method (Situation, Task, Action, Result).',
    '💡 Pro-Tip: Address high-severity skill gaps early in your preparation roadmap for maximum confidence.',
    '💡 Pro-Tip: Pay close attention to the "Intention" tag on technical questions to know what interviewers look for.',
    '💡 Pro-Tip: Download your tailored ATS-friendly resume to highlight keywords matching this job description.'
]

const LoadingRoadmap = () => {
    const [ progress, setProgress ] = useState(12)
    const [ activeStep, setActiveStep ] = useState(0)
    const [ tipIndex, setTipIndex ] = useState(0)

    useEffect(() => {
        // Progress bar simulation up to ~94%
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 94) return 94
                const increment = prev < 40 ? 3 : prev < 70 ? 2 : 1
                return prev + increment
            })
        }, 600)

        // Step transition timer
        const stepInterval = setInterval(() => {
            setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
        }, 5000)

        // Tip rotation timer
        const tipInterval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length)
        }, 6000)

        return () => {
            clearInterval(progressInterval)
            clearInterval(stepInterval)
            clearInterval(tipInterval)
        }
    }, [])

    return (
        <main className='loading-screen'>
            <div className='loading-container'>
                {/* Glowing Radar Animation */}
                <div className='loading-radar'>
                    <div className='radar-ring radar-ring--outer'></div>
                    <div className='radar-ring radar-ring--inner'></div>
                    <div className='radar-core'>
                        <span className='radar-icon'>🎯</span>
                    </div>
                </div>

                {/* Main Heading */}
                <div className='loading-header'>
                    <span className='loading-badge'>⚡ Live Strategy Synthesis</span>
                    <h1 className='loading-title'>Structuring Your Personalized Interview Plan</h1>
                    <p className='loading-subtitle'>
                        Deeply analyzing your experience against job requirements to build a winning strategy.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className='loading-progress-box'>
                    <div className='progress-meta'>
                        <span className='progress-status'>
                            {progress < 30 ? 'Extracting Candidate Experience...' :
                                progress < 60 ? 'Matching Position Requirements...' :
                                    progress < 85 ? 'Assessing Skill Gaps & Fit...' :
                                        'Finalizing Study Plan & Questions...'}
                        </span>
                        <span className='progress-percentage'>{progress}%</span>
                    </div>
                    <div className='progress-track'>
                        <div className='progress-fill' style={{ width: `${progress}%` }}>
                            <div className='progress-glow'></div>
                        </div>
                    </div>
                </div>

                {/* Multi-Step Checklist */}
                <div className='loading-steps'>
                    {STEPS.map((step, idx) => {
                        const isDone = idx < activeStep
                        const isCurrent = idx === activeStep
                        return (
                            <div
                                key={idx}
                                className={`loading-step ${isDone ? 'loading-step--done' : isCurrent ? 'loading-step--active' : 'loading-step--pending'}`}
                            >
                                <div className='step-indicator'>
                                    {isDone ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : isCurrent ? (
                                        <div className='step-spinner'></div>
                                    ) : (
                                        <span>{idx + 1}</span>
                                    )}
                                </div>
                                <div className='step-content'>
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Rotating Tip */}
                <div className='loading-tip-card'>
                    <p>{TIPS[tipIndex]}</p>
                </div>
            </div>
        </main>
    )
}

export default LoadingRoadmap
