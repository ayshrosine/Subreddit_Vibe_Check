import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import VibeSummary from './components/VibeSummary'
import VibePulseChart from './components/VibePulseChart'
import SentimentDistribution from './components/SentimentDistribution'
import PostFeed from './components/PostFeed'
import ErrorMessage from './components/ErrorMessage'
import { fetchSubredditHotPosts } from './services/redditApi'
import { analyzeSubreddit } from './utils/sentiment'
import { Radio, Heart, Github } from 'lucide-react'

export default function App() {
  const [activeSubreddit, setActiveSubreddit] = useState('technology')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  const loadSubreddit = useCallback(async (subredditName) => {
    if (!subredditName) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchSubredditHotPosts(subredditName)
      const result = analyzeSubreddit(data.posts)
      
      setActiveSubreddit(data.subreddit)
      setAnalysis(result)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
      setAnalysis(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load default subreddit on mount
  useEffect(() => {
    loadSubreddit(activeSubreddit)
  }, [])

  const handleSearch = (subreddit) => {
    loadSubreddit(subreddit)
  }

  const handleRefresh = () => {
    loadSubreddit(activeSubreddit)
  }

  return (
    <div className="app-container">
      {/* Header with popular chips */}
      <Header
        activeSubreddit={activeSubreddit}
        onSelectSubreddit={handleSearch}
      />

      {/* Main Search Controls */}
      <SearchBar
        activeSubreddit={activeSubreddit}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Error View */}
      {error && (
        <ErrorMessage
          error={error}
          onSelectSubreddit={handleSearch}
        />
      )}

      {/* Loading Skeleton UI */}
      {isLoading && (
        <div className="skeleton-container glass-card animate-fade-in">
          <div className="skeleton-header">
            <div className="skeleton-box skeleton-circle"></div>
            <div className="skeleton-lines">
              <div className="skeleton-box skeleton-line lg"></div>
              <div className="skeleton-box skeleton-line sm"></div>
            </div>
          </div>
          <div className="skeleton-grid">
            <div className="skeleton-box skeleton-tile"></div>
            <div className="skeleton-box skeleton-tile"></div>
            <div className="skeleton-box skeleton-tile"></div>
            <div className="skeleton-box skeleton-tile"></div>
          </div>
          <div className="skeleton-box skeleton-chart"></div>
          <p className="loading-status-text">
            <Radio className="spin-icon" size={16} /> Fetching 50 hot posts from r/{activeSubreddit} & scoring sentiment...
          </p>
        </div>
      )}

      {/* Main Dashboard Dashboard */}
      {!isLoading && !error && analysis && (
        <main className="dashboard-content">
          {/* Top Vibe Verdict & Score Meter */}
          <VibeSummary
            analysis={analysis}
            subreddit={activeSubreddit}
          />

          {/* SVG Vibe Wave Pulse Line Chart */}
          <VibePulseChart
            pulseData={analysis.pulseData}
          />

          {/* Mood Breakdown & Keyword Drivers */}
          <SentimentDistribution
            analysis={analysis}
          />

          {/* Posts Feed with Filter & Sorting */}
          <PostFeed
            posts={analysis.posts}
          />
        </main>
      )}

      {/* Dashboard Footer */}
      <footer className="app-footer">
        <p>
          <strong>The Subreddit Vibe Check</strong> • Powered by Client-Side AFINN/VADER Lexicon Scoring
        </p>
        <p className="footer-sub">
          100% Client-Side React SPA • No Backend • No Login Required
        </p>
      </footer>

      <style>{`
        .skeleton-container {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .skeleton-box {
          background: linear-gradient(
            90deg,
            var(--bg-surface) 25%,
            var(--bg-surface-elevated) 50%,
            var(--bg-surface) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
          border-radius: var(--radius-md);
        }

        .skeleton-circle {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
        }

        .skeleton-lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skeleton-line.lg {
          height: 24px;
          width: 40%;
        }

        .skeleton-line.sm {
          height: 16px;
          width: 60%;
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .skeleton-tile {
          height: 72px;
        }

        .skeleton-chart {
          height: 200px;
          margin-bottom: 1.5rem;
        }

        .loading-status-text {
          text-align: center;
          color: var(--accent-cyan);
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .app-footer {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-glass);
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .footer-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .skeleton-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
