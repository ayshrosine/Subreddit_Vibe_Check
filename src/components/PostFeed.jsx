import React, { useState, useMemo } from 'react'
import { ThumbsUp, MessageSquare, ExternalLink, Filter, ArrowUpDown, Search } from 'lucide-react'

export default function PostFeed({ posts }) {
  const [filter, setFilter] = useState('all') // 'all' | 'positive' | 'neutral' | 'negative'
  const [sortBy, setSortBy] = useState('feed') // 'feed' | 'pos-first' | 'neg-first' | 'upvotes'
  const [searchQuery, setSearchQuery] = useState('')

  // Filter & Sort Logic
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return []

    let result = [...posts]

    // 1. Apply Sentiment Filter
    if (filter !== 'all') {
      result = result.filter(p => p.sentiment === filter)
    }

    // 2. Apply Text Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }

    // 3. Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'pos-first') return b.score - a.score
      if (sortBy === 'neg-first') return a.score - b.score
      if (sortBy === 'upvotes') return b.ups - a.ups
      return a.feedIndex - b.feedIndex // default feed order
    })

    return result
  }, [posts, filter, sortBy, searchQuery])

  if (!posts || posts.length === 0) return null

  return (
    <div className="post-feed-container glass-card animate-fade-in">
      <div className="feed-header">
        <div>
          <h3 className="feed-title">Analyzed Post Feed</h3>
          <p className="feed-subtitle">
            Showing {filteredAndSortedPosts.length} of {posts.length} hot posts with title-level sentiment scoring
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="controls-row">
          {/* Sentiment Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({posts.length})
            </button>
            <button
              className={`filter-btn pos ${filter === 'positive' ? 'active' : ''}`}
              onClick={() => setFilter('positive')}
            >
              Positive ({posts.filter(p => p.sentiment === 'positive').length})
            </button>
            <button
              className={`filter-btn neu ${filter === 'neutral' ? 'active' : ''}`}
              onClick={() => setFilter('neutral')}
            >
              Neutral ({posts.filter(p => p.sentiment === 'neutral').length})
            </button>
            <button
              className={`filter-btn neg ${filter === 'negative' ? 'active' : ''}`}
              onClick={() => setFilter('negative')}
            >
              Negative ({posts.filter(p => p.sentiment === 'negative').length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrapper">
            <ArrowUpDown size={14} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="feed">Sort by Feed Order</option>
              <option value="pos-first">Most Positive First</option>
              <option value="neg-first">Most Negative First</option>
              <option value="upvotes">Highest Upvotes</option>
            </select>
          </div>
        </div>

        {/* Inline Search Filter */}
        <div className="title-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="title-search-input"
            placeholder="Filter titles by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Posts Cards List */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="posts-list">
          {filteredAndSortedPosts.map((post) => (
            <div key={post.id || post.feedIndex} className="post-card">
              <div className="post-meta-side">
                <span className="feed-rank">#{post.feedIndex}</span>
                <span className={`badge badge-${post.sentiment}`}>
                  {post.score > 0 ? `+${post.score}` : post.score}
                </span>
              </div>

              <div className="post-main-content">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="post-title-link"
                >
                  {post.title} <ExternalLink size={14} className="ext-icon" />
                </a>

                <div className="post-footer-stats">
                  <span className="stat-item">
                    <ThumbsUp size={13} /> {post.ups.toLocaleString()} upvotes
                  </span>
                  <span className="stat-item">
                    <MessageSquare size={13} /> {post.num_comments.toLocaleString()} comments
                  </span>

                  {/* Trigger Words Badges if any */}
                  {post.triggerWords.positive.length > 0 && (
                    <span className="trigger-word-inline pos">
                      + [{post.triggerWords.positive.join(', ')}]
                    </span>
                  )}
                  {post.triggerWords.negative.length > 0 && (
                    <span className="trigger-word-inline neg">
                      - [{post.triggerWords.negative.join(', ')}]
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-posts-box">
          <p>No titles match the selected filter or search query.</p>
        </div>
      )}

      <style>{`
        .post-feed-container {
          padding: 1.75rem;
        }

        .feed-header {
          margin-bottom: 1.5rem;
        }

        .feed-title {
          font-size: 1.25rem;
        }

        .feed-subtitle {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-top: 0.2rem;
          margin-bottom: 1.25rem;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.4rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          padding: 0.3rem;
          border-radius: var(--radius-md);
          flex-wrap: wrap;
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: var(--bg-surface-elevated);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .filter-btn.pos.active { color: var(--pos-green); }
        .filter-btn.neu.active { color: var(--neu-gray); }
        .filter-btn.neg.active { color: var(--neg-red); }

        .sort-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0 0.85rem;
        }

        .sort-icon {
          color: var(--text-muted);
          margin-right: 0.4rem;
        }

        .sort-select {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.65rem 0;
          outline: none;
          cursor: pointer;
        }

        .sort-select option {
          background: var(--bg-surface-elevated);
          color: var(--text-primary);
        }

        .title-search-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
          gap: 0.5rem;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .title-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.88rem;
        }

        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--accent-cyan);
          font-size: 0.8rem;
          cursor: pointer;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .post-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .post-card:hover {
          border-color: var(--border-glass-bright);
          transform: translateX(4px);
        }

        .post-meta-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          min-width: 60px;
        }

        .feed-rank {
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .post-main-content {
          flex: 1;
        }

        .post-title-link {
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.98rem;
          font-weight: 600;
          line-height: 1.4;
          display: inline-block;
          margin-bottom: 0.5rem;
          transition: color 0.2s ease;
        }

        .post-title-link:hover {
          color: var(--accent-cyan);
        }

        .ext-icon {
          opacity: 0.5;
          margin-left: 0.2rem;
          vertical-align: middle;
        }

        .post-footer-stats {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .trigger-word-inline {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .trigger-word-inline.pos { color: var(--pos-green); }
        .trigger-word-inline.neg { color: var(--neg-red); }

        .no-posts-box {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  )
}
