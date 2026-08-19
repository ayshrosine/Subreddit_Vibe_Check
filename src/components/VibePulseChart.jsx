import React, { useState } from 'react'
import { Activity, ExternalLink, ThumbsUp } from 'lucide-react'

export default function VibePulseChart({ pulseData }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!pulseData || pulseData.length === 0) return null

  // Dimensions for SVG
  const width = 800
  const height = 240
  const padding = { top: 30, right: 30, bottom: 40, left: 45 }

  const graphWidth = width - padding.left - padding.right
  const graphHeight = height - padding.top - padding.bottom

  // Y Scale: Score -1.0 to +1.0 mapped to graphHeight
  const getY = (score) => {
    // score ranges from -1 to 1. 1 is top (padding.top), -1 is bottom (height - padding.bottom)
    const normalized = (score + 1) / 2 // 0 to 1
    return height - padding.bottom - normalized * graphHeight
  }

  // X Scale: Post index 1 to N mapped to graphWidth
  const getX = (index) => {
    if (pulseData.length === 1) return padding.left + graphWidth / 2
    return padding.left + ((index - 1) / (pulseData.length - 1)) * graphWidth
  }

  // Build SVG Path
  const points = pulseData.map((d) => ({
    x: getX(d.index),
    y: getY(d.score),
    data: d
  }))

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, '')

  // Zero-line Y position
  const zeroY = getY(0)

  // Area path below zero line and above line
  const areaD = `${pathD} L ${getX(pulseData.length)} ${zeroY} L ${getX(1)} ${zeroY} Z`

  return (
    <div className="pulse-chart-card glass-card animate-fade-in">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">
            <Activity className="chart-icon" size={20} /> Vibe Trajectory Pulse
          </h3>
          <p className="chart-subtitle">
            Post-by-post sentiment wave across the top {pulseData.length} hot threads (Feed Order #1 → #{pulseData.length})
          </p>
        </div>
      </div>

      <div className="chart-svg-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="pulse-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient fill */}
            <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
            </linearGradient>

            {/* Stroke line gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Lines */}
          <line
            x1={padding.left}
            y1={getY(0.5)}
            x2={width - padding.right}
            y2={getY(0.5)}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={getY(-0.5)}
            x2={width - padding.right}
            y2={getY(-0.5)}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 3"
          />

          {/* Zero Neutral Baseline */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={padding.left - 8} y={zeroY + 4} className="svg-axis-label" textAnchor="end">
            0.0
          </text>
          <text x={padding.left - 8} y={getY(1) + 4} className="svg-axis-label pos" textAnchor="end">
            +1.0
          </text>
          <text x={padding.left - 8} y={getY(-1) + 4} className="svg-axis-label neg" textAnchor="end">
            -1.0
          </text>

          {/* Area Fill */}
          <path d={areaD} fill="url(#pulseGradient)" />

          {/* Main Pulse Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Interactive Data Points */}
          {points.map((pt) => {
            const isHovered = hoveredPoint && hoveredPoint.data.index === pt.data.index
            let pointColor = '#9ca3af'
            if (pt.data.sentiment === 'positive') pointColor = '#10b981'
            if (pt.data.sentiment === 'negative') pointColor = '#f43f5e'

            return (
              <g key={pt.data.index}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 3.5}
                  fill={pointColor}
                  stroke="#131927"
                  strokeWidth="2"
                  className="pulse-dot"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="pulse-tooltip animate-fade-in"
            style={{
              left: `${Math.min(80, Math.max(20, (hoveredPoint.x / width) * 100))}%`
            }}
          >
            <div className="tooltip-header">
              <span className="tooltip-index">Post #{hoveredPoint.data.index}</span>
              <span className={`badge badge-${hoveredPoint.data.sentiment}`}>
                {hoveredPoint.data.score > 0 ? `+${hoveredPoint.data.score}` : hoveredPoint.data.score}
              </span>
            </div>
            <p className="tooltip-title">{hoveredPoint.data.title}</p>
            <div className="tooltip-footer">
              <span>
                <ThumbsUp size={12} /> {hoveredPoint.data.ups.toLocaleString()} upvotes
              </span>
              <a
                href={hoveredPoint.data.permalink}
                target="_blank"
                rel="noreferrer"
                className="tooltip-link"
              >
                View on Reddit <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pulse-chart-card {
          padding: 1.75rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .chart-header {
          margin-bottom: 1.25rem;
        }

        .chart-title {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-icon {
          color: var(--accent-cyan);
        }

        .chart-subtitle {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-top: 0.2rem;
        }

        .chart-svg-container {
          position: relative;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          overflow: hidden;
        }

        .pulse-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .svg-axis-label {
          font-family: var(--font-body);
          font-size: 10px;
          fill: var(--text-muted);
          font-weight: 600;
        }

        .svg-axis-label.pos { fill: var(--pos-green); }
        .svg-axis-label.neg { fill: var(--neg-red); }

        .pulse-dot {
          cursor: pointer;
          transition: r 0.2s ease, fill 0.2s ease;
        }

        .pulse-dot:hover {
          filter: drop-shadow(0 0 6px currentColor);
        }

        .pulse-tooltip {
          position: absolute;
          top: 15px;
          transform: translateX(-50%);
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-glass-bright);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          width: 280px;
          z-index: 10;
          pointer-events: none;
        }

        .tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .tooltip-index {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .tooltip-title {
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tooltip-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .tooltip-link {
          color: var(--accent-cyan);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </div>
  )
}
