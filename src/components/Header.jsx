import React from 'react'
import { Radio, Sparkles, TrendingUp } from 'lucide-react'
import { POPULAR_SUBREDDITS } from '../services/redditApi'

export default function Header({ activeSubreddit, onSelectSubreddit }) {
  return (
    <header className="header-container animate-fade-in">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <Radio className="brand-icon" size={28} />
          <span className="live-dot" title="Live Reddit JSON Feed"></span>
        </div>
        <div>
          <h1 className="brand-title">
            Subreddit Vibe Check <span className="brand-badge">Client-Side NLP</span>
          </h1>
          <p className="brand-subtitle">
            Analyze the sentiment and emotional frequency of any Reddit community in real-time.
          </p>
        </div>
      </div>

      {/* Quick Select Preset Chips */}
      <div className="quick-chips-wrapper">
        <span className="chips-label">
          <Sparkles size={14} /> Popular Subs:
        </span>
        <div className="chips-scroll">
          {POPULAR_SUBREDDITS.map((sub) => {
            const isActive = activeSubreddit.toLowerCase() === sub.name.toLowerCase()
            return (
              <button
                key={sub.name}
                onClick={() => onSelectSubreddit(sub.name)}
                className={`chip-btn ${isActive ? 'active' : ''}`}
                type="button"
              >
                <span className="chip-icon">{sub.icon}</span>
                <span className="chip-text">{sub.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <style>{`
        .header-container {
          margin-bottom: 2rem;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .brand-icon-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid var(--border-glass-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .live-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: var(--pos-green);
          border: 2px solid var(--bg-primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--pos-green);
          animation: pulseGlow 2s infinite;
        }

        .brand-title {
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          letter-spacing: -0.02em;
        }

        .brand-badge {
          font-size: 0.72rem;
          font-weight: 700;
          font-family: var(--font-body);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          background: rgba(6, 182, 212, 0.15);
          color: var(--accent-cyan);
          border: 1px solid rgba(6, 182, 212, 0.3);
          vertical-align: middle;
        }

        .brand-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        .quick-chips-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .chips-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }

        .chips-scroll {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }

        .chips-scroll::-webkit-scrollbar {
          display: none;
        }

        .chip-btn {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-family: var(--font-body);
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .chip-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-glass-bright);
          transform: translateY(-1px);
        }

        .chip-btn.active {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25));
          border-color: var(--accent-cyan);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);
        }

        @media (max-width: 768px) {
          .brand-title {
            font-size: 1.6rem;
          }
          .quick-chips-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </header>
  )
}
