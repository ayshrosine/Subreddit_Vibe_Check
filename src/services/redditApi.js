/**
 * Reddit Public Feed API Service
 * Fetches real-time JSON feed without OAuth or backend requirements.
 */

// Popular subreddits for quick-select chips
export const POPULAR_SUBREDDITS = [
  { name: 'technology', label: 'r/technology', icon: '💻' },
  { name: 'wallstreetbets', label: 'r/wallstreetbets', icon: '📈' },
  { name: 'askreddit', label: 'r/askreddit', icon: '💬' },
  { name: 'gaming', label: 'r/gaming', icon: '🎮' },
  { name: 'science', label: 'r/science', icon: '🔬' },
  { name: 'showerthoughts', label: 'r/showerthoughts', icon: '💡' },
  { name: 'aww', label: 'r/aww', icon: '🐾' },
  { name: 'worldnews', label: 'r/worldnews', icon: '🌐' }
]

/**
 * Sanitize input to clean subreddit name
 */
export function sanitizeSubredditName(input) {
  if (!input) return ''
  return input
    .trim()
    .replace(/^r\//i, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
}

/**
 * Fetch top 50 hot posts directly from Reddit public JSON endpoint.
 * 100% real-time data only - no synthetic or mock fallbacks.
 */
export async function fetchSubredditHotPosts(subreddit) {
  const cleanSub = sanitizeSubredditName(subreddit)
  if (!cleanSub) {
    throw new Error('Please enter a valid subreddit name.')
  }

  // Endpoints to query directly (Reddit public feeds)
  const endpoints = [
    `https://www.reddit.com/r/${cleanSub}/hot.json?limit=50&raw_json=1`,
    `https://old.reddit.com/r/${cleanSub}/hot.json?limit=50&raw_json=1`
  ]

  let lastError = null

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.status === 404) {
        throw new Error(`Subreddit 'r/${cleanSub}' was not found. Please check the spelling.`)
      }
      if (response.status === 403) {
        throw new Error(`Subreddit 'r/${cleanSub}' is private, quarantined, or banned.`)
      }
      if (response.status === 429) {
        throw new Error(`Reddit API rate limit reached. Please wait a few seconds before retrying.`)
      }

      if (!response.ok) {
        throw new Error(`Reddit returned HTTP ${response.status} for r/${cleanSub}.`)
      }

      const data = await response.json()

      if (!data || !data.data || !Array.isArray(data.data.children)) {
        throw new Error(`Invalid data format received from Reddit for r/${cleanSub}.`)
      }

      const children = data.data.children

      if (children.length === 0) {
        throw new Error(`Subreddit 'r/${cleanSub}' exists but has no active hot posts currently.`)
      }

      const posts = children.map((child) => {
        const p = child.data
        return {
          id: p.id,
          title: p.title || 'Untitled Post',
          permalink: p.permalink ? `https://www.reddit.com${p.permalink}` : `https://www.reddit.com/r/${cleanSub}`,
          ups: p.ups || 0,
          num_comments: p.num_comments || 0,
          author: p.author || 'anonymous',
          created_utc: p.created_utc || Date.now() / 1000,
          is_pinned: p.stickied || false,
          subreddit: cleanSub
        }
      })

      return {
        subreddit: cleanSub,
        posts
      }
    } catch (err) {
      lastError = err
    }
  }

  // If both endpoints fail, throw real error (no mock data fallback)
  if (lastError) {
    if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
      throw new Error(`Network or CORS error connecting to Reddit API for r/${cleanSub}. Check internet connection or ad-blocker settings.`)
    }
    throw lastError
  }

  throw new Error(`Unable to fetch real-time posts from r/${cleanSub}.`)
}
