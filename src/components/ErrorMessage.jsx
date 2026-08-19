import React from 'react'
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react'
import { POPULAR_SUBREDDITS } from '../services/redditApi'

export default function ErrorMessage({ error, onSelectSubreddit }) {
  if (!error) return null

  return (
    <div className="error-card glass-card animate-fade-in">
      <div className="error-icon-box">
        <AlertCircle size={32} />
      </div>

      <div className="error-content">
        <h3 className="error-title">Unable to Perform Vibe Check</h3>
        <p className="error-description">{error}</p>

        <div className="suggestions-box">
          <h4 className="suggestions-title">
            <HelpCircle size={15} /> Troubleshooting Tips:
          </h4>
          <ul className="suggestions-list">
            <li>Verify the subreddit name spelling (e.g. <code>r/technology</code> instead of <code>r/tech</code>).</li>
            <li>Ensure the subreddit is public and not private or quarantined.</li>
            <li>If rate-limited by Reddit, wait 10 seconds before refreshing.</li>
          </ul>
        </div>

        <div className="error-popular-chips">
          <span className="chips-title">Try one of these instead:</span>
          <div className="chips-row">
            {POPULAR_SUBREDDITS.slice(0, 4).map((sub) => (
              <button
                key={sub.name}
                onClick={() => onSelectSubreddit(sub.name)}
                className="error-chip-btn"
                type="button"
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .error-card {
          padding: 2rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1.5rem;
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.05);
        }

        .error-icon-box {
          color: var(--neg-red);
          flex-shrink: 0;
          padding-top: 0.2rem;
        }

        .error-content {
          flex: 1;
        }

        .error-title {
          font-size: 1.3rem;
          color: var(--neg-red);
          margin-bottom: 0.4rem;
        }

        .error-description {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: 1.25rem;
        }

        .suggestions-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          margin-bottom: 1.25rem;
        }

        .suggestions-title {
          font-size: 0.88rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .suggestions-list {
          padding-left: 1.2rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .suggestions-list li {
          margin-bottom: 0.25rem;
        }

        .suggestions-list code {
          background: var(--bg-surface-elevated);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          color: var(--accent-cyan);
        }

        .error-popular-chips {
          margin-top: 1rem;
        }

        .chips-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .chips-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .error-chip-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }

        .error-chip-btn:hover {
          border-color: var(--accent-cyan);
          background: var(--bg-surface-elevated);
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .error-card {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
