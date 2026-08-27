import React, { useEffect, useState } from 'react'

const ScoreGauge = ({ score = 0, size = 160 }) => {
    const [ currentScore, setCurrentScore ] = useState(0)

    useEffect(() => {
        let start = 0
        const duration = 1200
        const stepTime = 20
        const totalSteps = duration / stepTime
        const stepIncrement = score / totalSteps

        const timer = setInterval(() => {
            start += stepIncrement
            if (start >= score) {
                setCurrentScore(score)
                clearInterval(timer)
            } else {
                setCurrentScore(Math.floor(start))
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [ score ])

    const strokeWidth = 12
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (currentScore / 100) * circumference

    const getScoreTheme = (val) => {
        if (val >= 80) return {
            gradient: ['#10b981', '#06b6d4'],
            label: 'Strong Match',
            badgeBg: 'rgba(16, 185, 129, 0.15)',
            badgeColor: '#34d399',
            glow: 'rgba(16, 185, 129, 0.4)'
        }
        if (val >= 60) return {
            gradient: ['#f59e0b', '#fbbf24'],
            label: 'Good Alignment',
            badgeBg: 'rgba(245, 158, 11, 0.15)',
            badgeColor: '#fbbf24',
            glow: 'rgba(245, 158, 11, 0.4)'
        }
        return {
            gradient: ['#ff2d78', '#f43f5e'],
            label: 'Targeted Prep Needed',
            badgeBg: 'rgba(255, 45, 120, 0.15)',
            badgeColor: '#ff6b9d',
            glow: 'rgba(255, 45, 120, 0.4)'
        }
    }

    const theme = getScoreTheme(score)
    const gradientId = `scoreGradient-${score}`

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative'
        }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={theme.gradient[0]} />
                            <stop offset="100%" stopColor={theme.gradient[1]} />
                        </linearGradient>
                    </defs>

                    {/* Background Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: `drop-shadow(0 0 8px ${theme.glow})`
                        }}
                    />
                </svg>

                {/* Central Score Display */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    <span style={{
                        fontSize: '2.25rem',
                        fontWeight: '800',
                        color: '#fff',
                        lineHeight: 1,
                        letterSpacing: '-0.5px'
                    }}>
                        {currentScore}%
                    </span>
                    <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#8b949e',
                        marginTop: '4px',
                        fontWeight: '600'
                    }}>
                        Fit Score
                    </span>
                </div>
            </div>

            {/* Assessment Badge */}
            <span style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: theme.badgeBg,
                color: theme.badgeColor,
                border: `1px solid ${theme.badgeColor}33`,
                boxShadow: `0 0 12px ${theme.glow}`
            }}>
                {theme.label}
            </span>
        </div>
    )
}

export default ScoreGauge
