import React from 'react'
import { ThumbsUp, MessageSquare, Flame, Award, Hash, Zap } from 'lucide-react'

export default function VibeSummary({ analysis, subreddit }) {
  if (!analysis) return null

  const { verdict, percentages, counts, metrics, averageScore, totalPosts } = analysis

  // Normalize score (-1 to +1) to percentage (0% to 100%) for gauge meter position
  const meterPercent = Math.max(5, Math.min(95, ((averageScore + 1) / 2) * 100))

  return (
    <div className={`vibe-summary-card glass-card theme-${verdict.theme} animate-fade-in`}>
      <div className="summary-header">
        <div className="verdict-main">
          <div className="verdict-icon-glow">
            <span className="verdict-emoji">{verdict.emoji}</span>
          </div>
          <div>
            <div className="subreddit-badge">
              <Hash size={14} /> r/{subreddit}
            </div>
            <h2 className="verdict-title">{verdict.title}</h2>
            <p className="verdict-tagline">{verdict.tagline}</p>
          </div>
        </div>

        {/* Sentiment Gauge Meter */}
        <div className="gauge-box">
          <div className="gauge-header">
            <span className="gauge-label">Vibe Index Score</span>
            <span className="gauge-score-value">
              {averageScore > 0 ? `+${averageScore}` : averageScore}
            </span>
          </div>
          <div className="gauge-bar-track">
            <div
              className="gauge-pointer"
              style={{ left: `${meterPercent}%` }}
              title={`Score: ${averageScore}`}
            />
          </div>
          <div className="gauge-labels">
            <span>-1.0 (Stormy)</span>
            <span>0.0 (Neutral)</span>
            <span>+1.0 (Bullish)</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-tile tile-total">
          <div className="tile-icon">
            <Zap size={20} />
          </div>
          <div className="tile-content">
            <span className="tile-value">{totalPosts}</span>
            <span className="tile-label">Hot Posts Analyzed</span>
          </div>
        </div>

        <div className="metric-tile tile-positive">
          <div className="tile-icon">
            <ThumbsUp size={20} />
          </div>
          <div className="tile-content">
            <div className="tile-value-group">
              <span className="tile-value">{percentages.positive}%</span>
              <span className="tile-sub">({counts.positive})</span>
            </div>
            <span className="tile-label">Positive Sentiment</span>
          </div>
        </div>

        <div className="metric-tile tile-neutral">
          <div className="tile-icon">
            <Award size={20} />
          </div>
          <div className="tile-content">
            <div className="tile-value-group">
              <span className="tile-value">{percentages.neutral}%</span>
              <span className="tile-sub">({counts.neutral})</span>
            </div>
            <span className="tile-label">Neutral / Objective</span>
          </div>
        </div>

        <div className="metric-tile tile-negative">
          <div className="tile-icon">
            <Flame size={20} />
          </div>
          <div className="tile-content">
            <div className="tile-value-group">
              <span className="tile-value">{percentages.negative}%</span>
              <span className="tile-sub">({counts.negative})</span>
            </div>
            <span className="tile-label">Critical / Negative</span>
          </div>
        </div>
      </div>

      <style>{`
        .vibe-summary-card {
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .vibe-summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .vibe-summary-card.theme-positive::before {
          background: linear-gradient(90deg, var(--pos-green), var(--accent-cyan));
        }
        .vibe-summary-card.theme-negative::before {
          background: linear-gradient(90deg, var(--neg-red), #f97316);
        }
        .vibe-summary-card.theme-neutral::before {
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet));
        }
        .vibe-summary-card.theme-mixed::before {
          background: linear-gradient(90deg, var(--pos-green), var(--neg-red));
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .verdict-main {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .verdict-icon-glow {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .verdict-emoji {
          font-size: 2.2rem;
        }

        .subreddit-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-transform: lowercase;
          margin-bottom: 0.25rem;
        }

        .verdict-title {
          font-size: 1.8rem;
          letter-spacing: -0.01em;
          margin-bottom: 0.25rem;
        }

        .verdict-tagline {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 480px;
        }

        .gauge-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          min-width: 280px;
          flex-shrink: 0;
        }

        .gauge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        .gauge-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .gauge-score-value {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--accent-cyan);
        }

        .gauge-bar-track {
          height: 10px;
          background: linear-gradient(90deg, var(--neg-red) 0%, var(--neu-gray) 50%, var(--pos-green) 100%);
          border-radius: var(--radius-full);
          position: relative;
          margin-bottom: 0.5rem;
        }

        .gauge-pointer {
          position: absolute;
          top: -3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--bg-primary);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          transform: translateX(-50%);
          transition: left 0.5s ease-out;
        }

        .gauge-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .metric-tile {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .metric-tile:hover {
          transform: translateY(-2px);
          border-color: var(--border-glass-bright);
        }

        .tile-icon {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tile-total .tile-icon {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-violet);
        }

        .tile-positive .tile-icon {
          background: var(--pos-green-bg);
          color: var(--pos-green);
        }

        .tile-neutral .tile-icon {
          background: var(--neu-gray-bg);
          color: var(--neu-gray);
        }

        .tile-negative .tile-icon {
          background: var(--neg-red-bg);
          color: var(--neg-red);
        }

        .tile-value-group {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .tile-value {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .tile-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .tile-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: block;
        }

        @media (max-width: 768px) {
          .summary-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .gauge-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
