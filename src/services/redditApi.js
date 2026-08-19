/**
 * Reddit Public Feed API Service
 * Fetches JSON without OAuth or backend requirements.
 */

// Popular sample subreddits for quick-select chips
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
 * Fetch top 50 hot posts from Reddit public JSON endpoint
 */
export async function fetchSubredditHotPosts(subreddit) {
  const cleanSub = sanitizeSubredditName(subreddit)
  if (!cleanSub) {
    throw new Error('Please enter a valid subreddit name.')
  }

  const url = `https://www.reddit.com/r/${cleanSub}/hot.json?limit=50&raw_json=1`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Subreddit 'r/${cleanSub}' was not found. Please check the spelling.`)
      }
      if (response.status === 403) {
        throw new Error(`Subreddit 'r/${cleanSub}' is private, quarantined, or banned.`)
      }
      if (response.status === 429) {
        throw new Error(`Reddit rate limit hit. Please wait a few seconds and try again.`)
      }
      throw new Error(`Failed to load r/${cleanSub} (HTTP ${response.status}).`)
    }

    const data = await response.json()

    if (!data || !data.data || !Array.isArray(data.data.children)) {
      throw new Error(`Invalid response received from Reddit for r/${cleanSub}.`)
    }

    const children = data.data.children

    if (children.length === 0) {
      throw new Error(`Subreddit 'r/${cleanSub}' exists but has no active hot posts.`)
    }

    // Filter out pinned moderator announcement threads if desired, or keep all
    const posts = children.map(child => {
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
    // If browser CORS or network block happens, throw detailed error
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Network or CORS error connecting to Reddit. Check internet connection or ad-blocker.`)
    }
    throw err
  }
}
