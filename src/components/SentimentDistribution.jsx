import React from 'react'
import { PieChart, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'

export default function SentimentDistribution({ analysis }) {
  if (!analysis) return null

  const { percentages, counts, topPositiveWords, topNegativeWords } = analysis

  return (
    <div className="distribution-card glass-card animate-fade-in">
      <div className="card-header">
        <h3 className="section-title">
          <PieChart className="section-icon" size={20} /> Mood Breakdown & Trigger Lexicon
        </h3>
        <p className="section-subtitle">
          Proportional sentiment allocation and top emotionally charged keywords detected in post titles.
        </p>
      </div>

      {/* Proportional Stacked Bar */}
      <div className="stacked-bar-container">
        <div className="stacked-bar-track">
          {percentages.positive > 0 && (
            <div
              className="bar-segment pos-segment"
              style={{ width: `${percentages.positive}%` }}
              title={`Positive: ${percentages.positive}% (${counts.positive} posts)`}
            />
          )}
          {percentages.neutral > 0 && (
            <div
              className="bar-segment neu-segment"
              style={{ width: `${percentages.neutral}%` }}
              title={`Neutral: ${percentages.neutral}% (${counts.neutral} posts)`}
            />
          )}
          {percentages.negative > 0 && (
            <div
              className="bar-segment neg-segment"
              style={{ width: `${percentages.negative}%` }}
              title={`Negative: ${percentages.negative}% (${counts.negative} posts)`}
            />
          )}
        </div>

        <div className="stacked-bar-legend">
          <div className="legend-item">
            <span className="legend-dot pos"></span>
            <span>Positive ({percentages.positive}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot neu"></span>
            <span>Neutral ({percentages.neutral}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot neg"></span>
            <span>Negative ({percentages.negative}%)</span>
          </div>
        </div>
      </div>

      {/* Trigger Words Keywords Grid */}
      <div className="keywords-grid">
        {/* Positive Trigger Words */}
        <div className="keyword-box pos-box">
          <div className="box-title">
            <Sparkles size={16} className="pos-icon" /> Top Upbeat Drivers
          </div>
          {topPositiveWords.length > 0 ? (
            <div className="chips-cloud">
              {topPositiveWords.map(({ word, count }) => (
                <span key={word} className="trigger-chip pos-chip">
                  <span className="word-text">+{word}</span>
                  <span className="word-count">{count}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="no-words">No strong positive keyword triggers detected.</p>
          )}
        </div>

        {/* Negative Trigger Words */}
        <div className="keyword-box neg-box">
          <div className="box-title">
            <AlertTriangle size={16} className="neg-icon" /> Top Critical Drivers
          </div>
          {topNegativeWords.length > 0 ? (
            <div className="chips-cloud">
              {topNegativeWords.map(({ word, count }) => (
                <span key={word} className="trigger-chip neg-chip">
                  <span className="word-text">-{word}</span>
                  <span className="word-count">{count}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="no-words">No strong negative keyword triggers detected.</p>
          )}
        </div>
      </div>

      <style>{`
        .distribution-card {
          padding: 1.75rem;
          margin-bottom: 2rem;
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          color: var(--accent-cyan);
        }

        .section-subtitle {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-top: 0.2rem;
        }

        .stacked-bar-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .stacked-bar-track {
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          overflow: hidden;
          background: var(--bg-surface-elevated);
          margin-bottom: 1rem;
        }

        .bar-segment {
          height: 100%;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pos-segment {
          background: linear-gradient(90deg, #059669, #10b981);
          box-shadow: 0 0 12px var(--pos-green-glow);
        }
        .neu-segment {
          background: linear-gradient(90deg, #6b7280, #9ca3af);
        }
        .neg-segment {
          background: linear-gradient(90deg, #e11d48, #f43f5e);
          box-shadow: 0 0 12px var(--neg-red-glow);
        }

        .stacked-bar-legend {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .legend-dot.pos { background: var(--pos-green); }
        .legend-dot.neu { background: var(--neu-gray); }
        .legend-dot.neg { background: var(--neg-red); }

        .keywords-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .keyword-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .box-title {
          font-size: 0.95rem;
          font-weight: 700;
          font-family: var(--font-heading);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .pos-icon { color: var(--pos-green); }
        .neg-icon { color: var(--neg-red); }

        .chips-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .trigger-chip {
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .pos-chip {
          background: var(--pos-green-bg);
          color: var(--pos-green);
          border: 1px solid var(--pos-green-border);
        }

        .neg-chip {
          background: var(--neg-red-bg);
          color: var(--neg-red);
          border: 1px solid var(--neg-red-border);
        }

        .word-count {
          opacity: 0.75;
          font-size: 0.72rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .no-words {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }

        @media (max-width: 640px) {
          .keywords-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
