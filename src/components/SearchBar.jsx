import React, { useState, useEffect } from 'react'
import { Search, RefreshCw, X } from 'lucide-react'

export default function SearchBar({ activeSubreddit, onSearch, onRefresh, isLoading }) {
  const [inputValue, setInputValue] = useState(activeSubreddit)

  // Keep input in sync if activeSubreddit changes externally via chips
  useEffect(() => {
    setInputValue(activeSubreddit)
  }, [activeSubreddit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue)
    }
  }

  const handleClear = () => {
    setInputValue('')
  }

  return (
    <div className="search-bar-container glass-card">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-wrapper">
          <span className="prefix-tag">r/</span>
          <input
            type="text"
            className="search-input"
            placeholder="enter subreddit (e.g. technology, wallstreetbets, askreddit)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          {inputValue && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              title="Clear input"
              disabled={isLoading}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="actions-group">
          <button
            type="submit"
            className="btn-primary search-btn"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="spin-icon" /> Analyzing...
              </>
            ) : (
              <>
                <Search size={18} /> Run Vibe Check
              </>
            )}
          </button>

          <button
            type="button"
            className="refresh-btn"
            onClick={onRefresh}
            title="Refresh current subreddit feed"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'spin-icon' : ''} />
          </button>
        </div>
      </form>

      <style>{`
        .search-bar-container {
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
        }

        .search-form {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding-left: 1.2rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px var(--accent-cyan-glow);
        }

        .prefix-tag {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--accent-cyan);
          user-select: none;
          margin-right: 0.25rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 1.05rem;
          padding: 0.85rem 0.5rem 0.85rem 0;
        }

        .search-input::placeholder {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .clear-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .clear-btn:hover {
          color: var(--text-primary);
        }

        .actions-group {
          display: flex;
          gap: 0.75rem;
        }

        .search-btn {
          white-space: nowrap;
        }

        .refresh-btn {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          border-color: var(--border-glass-bright);
          color: var(--text-primary);
          background: var(--bg-glass);
        }

        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .search-form {
            flex-direction: column;
          }
          .input-wrapper {
            width: 100%;
          }
          .actions-group {
            width: 100%;
          }
          .search-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}
