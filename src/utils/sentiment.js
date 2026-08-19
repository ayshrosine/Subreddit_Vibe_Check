/**
 * Client-Side Sentiment Analysis Engine
 * Based on AFINN-165 & VADER Heuristics (lexicon-based with negations, booster words, and emoji scoring)
 */

// Lexicon dictionary: word -> score (-5 to +5)
const LEXICON = {
  // Ultra Positive (+4 to +5)
  'awesome': 4, 'superb': 5, 'outstanding': 5, 'breathtaking': 5, 'masterpiece': 5,
  'triumph': 4, 'thrilled': 4, 'phenomenal': 5, 'legendary': 5, 'spectacular': 4,
  'flawless': 5, 'brilliant': 4, 'wholesome': 4, 'bullish': 4, 'breakthrough': 4,
  'cheers': 3, 'inspirational': 4, 'glorious': 4, 'victory': 4, 'winner': 4,

  // Positive (+2 to +3)
  'good': 2, 'great': 3, 'love': 3, 'happy': 3, 'best': 3, 'amazing': 3, 'excellent': 3,
  'nice': 2, 'cool': 2, 'fun': 2, 'beautiful': 3, 'solid': 2, 'enjoy': 2, 'enjoyable': 2,
  'helpful': 2, 'impressive': 3, 'favorite': 3, 'favourite': 3, 'hope': 2, 'hopeful': 2,
  'success': 3, 'successful': 3, 'boost': 2, 'win': 3, 'winning': 3, 'gain': 2, 'growth': 2,
  'excited': 3, 'exciting': 3, 'sweet': 2, 'wonderful': 3, 'perfect': 3, 'strong': 2,
  'smart': 2, 'clever': 2, 'creative': 2, 'upgrade': 2, 'pro': 2, 'innovative': 3,
  'recommend': 2, 'reward': 2, 'worth': 2, 'upvote': 2, 'clarity': 2, 'peace': 2,

  // Mildly Positive (+1)
  'plus': 1, 'like': 1, 'yes': 1, 'cool': 1, 'interested': 1, 'cute': 1, 'fair': 1,
  'safe': 1, 'valid': 1, 'agree': 1, 'care': 1, 'friend': 1, 'kind': 1, 'fresh': 1,

  // Mildly Negative (-1)
  'slow': -1, 'odd': -1, 'weird': -1, 'hard': -1, 'doubt': -1, 'risk': -1, 'risky': -1,
  'confused': -1, 'tiring': -1, 'busy': -1, 'costly': -1, 'lost': -1, 'late': -1,

  // Negative (-2 to -3)
  'bad': -2, 'worst': -3, 'hate': -3, 'sad': -2, 'poor': -2, 'ugly': -2, 'angry': -3,
  'annoying': -2, 'bother': -2, 'fail': -2, 'failed': -2, 'failure': -3, 'fault': -2,
  'wrong': -2, 'terrible': -3, 'horrible': -3, 'awful': -3, 'boring': -2, 'scam': -3,
  'fake': -2, 'pain': -2, 'painful': -2, 'scared': -2, 'scary': -2, 'afraid': -2,
  'fear': -2, 'lose': -2, 'losing': -2, 'loss': -2, 'drop': -2, 'crash': -3, 'bearish': -3,
  'broken': -2, 'harm': -2, 'hurt': -2, 'problem': -2, 'issue': -2, 'crisis': -3,
  'danger': -2, 'dangerous': -2, 'dump': -2, 'dumping': -2, 'ruin': -3, 'ruined': -3,
  'complaint': -2, 'sucks': -3, 'trash': -3, 'garbage': -3, 'stupid': -3, 'dumb': -3,

  // Ultra Negative (-4 to -5)
  'disaster': -4, 'devastating': -4, 'tragic': -4, 'tragedy': -4, 'horrific': -5,
  'outrage': -4, 'outraged': -4, 'disgusting': -4, 'evil': -4, 'corrupt': -4,
  'catastrophe': -5, 'atrocious': -5, 'fatal': -4, 'deadly': -4, 'kill': -4,
  'destroy': -4, 'destroyed': -4, 'abusive': -4, 'nightmare': -4, 'fraud': -4,

  // Emojis
  '🚀': 4, '🔥': 3, '❤️': 3, '💖': 3, '😍': 3, '🥰': 3, '😊': 2, '😄': 2, '👍': 2,
  '💯': 3, '🎉': 3, '✨': 2, '📈': 3, '🙌': 2, '💪': 2, '⭐': 2, '🏆': 3,
  '😭': -2, '💔': -3, '😡': -3, '🤬': -4, '🤮': -4, '💩': -3, '📉': -3, '👎': -2,
  '💀': -2, '⚠️': -2, '🤡': -2, '🤮': -3, '🥀': -2, '🤦': -2
}

// Negation words flip score of the next word
const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'neither', 'nor', 'none', 'without', 'cannot', 'cant',
  "can't", 'couldnt', "couldn't", 'isnt', "isn't", 'arent', "aren't", 'wasnt',
  "wasn't", 'werent', "weren't", 'dont', "don't", 'doesnt', "doesn't", 'didnt',
  "didn't", 'wont', "won't", 'wouldnt', "wouldn't", 'havent', "haven't", 'hasnt', "hasn't"
])

// Booster / Intensifier words scale the score of the next word
const BOOSTERS = {
  'very': 1.5,
  'really': 1.4,
  'extremely': 2.0,
  'super': 1.6,
  'insanely': 1.8,
  'hugely': 1.5,
  'so': 1.3,
  'too': 1.2,
  'incredibly': 1.8,
  'absolutely': 1.7,
  'totally': 1.4,
  'completely': 1.4,
  'crazy': 1.4
}

/**
 * Clean & tokenize title string
 */
export function tokenize(text) {
  if (!text) return []
  // Split emojis out as separate tokens while extracting words
  const cleanText = text.toLowerCase()
  // Match words, contractions, or emojis
  const tokens = cleanText.match(/[\p{L}\p{N}'’]+|[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []
  return tokens
}

/**
 * Analyze sentiment of a single post title
 */
export function analyzeTitle(title) {
  const tokens = tokenize(title)
  if (tokens.length === 0) {
    return { score: 0, normalizedScore: 0, sentiment: 'neutral', triggerWords: { positive: [], negative: [] } }
  }

  let totalScore = 0
  let matchedCount = 0
  const positiveWords = []
  const negativeWords = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/^['’]+|['’]+$/g, '')
    
    // Check if token exists in lexicon
    if (LEXICON.hasOwnProperty(token) || LEXICON.hasOwnProperty(tokens[i])) {
      let score = LEXICON[token] || LEXICON[tokens[i]]

      // Check preceding word for negation (up to 2 words back)
      let isNegated = false
      if (i > 0 && NEGATION_WORDS.has(tokens[i - 1])) isNegated = true
      if (i > 1 && NEGATION_WORDS.has(tokens[i - 2])) isNegated = true

      // Check preceding word for booster
      let booster = 1.0
      if (i > 0 && BOOSTERS.hasOwnProperty(tokens[i - 1])) {
        booster = BOOSTERS[tokens[i - 1]]
      }

      if (isNegated) {
        score = -score * 0.8 // Flip polarity with slight reduction
      } else {
        score = score * booster
      }

      totalScore += score
      matchedCount++

      if (score > 0) {
        positiveWords.push(token)
      } else if (score < 0) {
        negativeWords.push(token)
      }
    }
  }

  // Normalize score between -1.0 and +1.0
  // Standard VADER normalization formula: x / sqrt(x^2 + alpha)
  const alpha = 15
  const normalizedScore = matchedCount === 0 
    ? 0 
    : Math.max(-1, Math.min(1, totalScore / Math.sqrt(Math.pow(totalScore, 2) + alpha)))

  let sentiment = 'neutral'
  if (normalizedScore >= 0.15) {
    sentiment = 'positive'
  } else if (normalizedScore <= -0.15) {
    sentiment = 'negative'
  }

  return {
    rawScore: totalScore,
    normalizedScore: parseFloat(normalizedScore.toFixed(3)),
    sentiment,
    triggerWords: {
      positive: [...new Set(positiveWords)],
      negative: [...new Set(negativeWords)]
    }
  }
}

/**
 * Aggregate sentiment metrics across all posts in a subreddit
 */
export function analyzeSubreddit(posts) {
  if (!posts || posts.length === 0) {
    return null
  }

  let positiveCount = 0
  let neutralCount = 0
  let negativeCount = 0
  let totalScoreSum = 0
  let totalUpvotes = 0
  let totalComments = 0

  const posWordFreq = {}
  const negWordFreq = {}

  const analyzedPosts = posts.map((post, index) => {
    const analysis = analyzeTitle(post.title)
    
    if (analysis.sentiment === 'positive') positiveCount++
    else if (analysis.sentiment === 'negative') negativeCount++
    else neutralCount++

    totalScoreSum += analysis.normalizedScore
    totalUpvotes += (post.ups || 0)
    totalComments += (post.num_comments || 0)

    // Tally word frequencies
    analysis.triggerWords.positive.forEach(word => {
      posWordFreq[word] = (posWordFreq[word] || 0) + 1
    })
    analysis.triggerWords.negative.forEach(word => {
      negWordFreq[word] = (negWordFreq[word] || 0) + 1
    })

    return {
      ...post,
      feedIndex: index + 1,
      score: analysis.normalizedScore,
      sentiment: analysis.sentiment,
      triggerWords: analysis.triggerWords
    }
  })

  const totalPosts = analyzedPosts.length
  const averageScore = parseFloat((totalScoreSum / totalPosts).toFixed(3))

  const positivePercent = Math.round((positiveCount / totalPosts) * 100)
  const neutralPercent = Math.round((neutralCount / totalPosts) * 100)
  const negativePercent = Math.round((negativeCount / totalPosts) * 100)

  // Sort word frequencies
  const topPositiveWords = Object.entries(posWordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))

  const topNegativeWords = Object.entries(negWordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))

  // Determine Vibe Verdict
  const verdict = generateVibeVerdict(averageScore, positivePercent, neutralPercent, negativePercent, totalPosts)

  // Pulse line graph dataset
  const pulseData = analyzedPosts.map(p => ({
    index: p.feedIndex,
    title: p.title,
    score: p.score,
    sentiment: p.sentiment,
    ups: p.ups,
    permalink: p.permalink
  }))

  return {
    totalPosts,
    averageScore,
    counts: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount
    },
    percentages: {
      positive: positivePercent,
      neutral: neutralPercent,
      negative: negativePercent
    },
    metrics: {
      totalUpvotes,
      totalComments,
      avgUpvotesPerPost: Math.round(totalUpvotes / totalPosts)
    },
    verdict,
    topPositiveWords,
    topNegativeWords,
    pulseData,
    posts: analyzedPosts
  }
}

/**
 * Generate human-readable Vibe Verdict with badges and descriptions
 */
function generateVibeVerdict(avgScore, posPct, neuPct, negPct, totalPosts) {
  if (posPct >= 60) {
    return {
      title: "⚡ Energetically Upbeat",
      tagline: "High optimism! The community is overwhelming positive and enthusiastic.",
      theme: "positive",
      emoji: "🚀"
    }
  }
  if (posPct >= 45 && negPct < 25) {
    return {
      title: "💖 Wholesome & Positive",
      tagline: "Warm vibes dominate with plenty of supportive, cheerful discussions.",
      theme: "positive",
      emoji: "✨"
    }
  }
  if (negPct >= 50) {
    return {
      title: "🌧️ Deeply Gloomy",
      tagline: "High cynicism and frustration. Negative posts outweigh constructive ones.",
      theme: "negative",
      emoji: "🌩️"
    }
  }
  if (negPct >= 35 && posPct < 30) {
    return {
      title: "🔥 Heated & Critical",
      tagline: "Tension in the air! Community members are vocal about flaws and issues.",
      theme: "negative",
      emoji: "💢"
    }
  }
  if (posPct >= 30 && negPct >= 30) {
    return {
      title: "⚡ High Energy Debate",
      tagline: "Strong Opinions! Sharp mix of passionate praises and intense critiques.",
      theme: "mixed",
      emoji: "🤼"
    }
  }
  if (neuPct >= 55) {
    return {
      title: "⚖️ Calm & Informational",
      tagline: "Mostly news, queries, and neutral discussions without heavy emotional bias.",
      theme: "neutral",
      emoji: "📊"
    }
  }
  
  // Default moderate verdict
  if (avgScore > 0.05) {
    return {
      title: "🌱 Mildly Optimistic",
      tagline: "Slightly positive lean with a healthy mix of balanced discussion.",
      theme: "positive",
      emoji: "☀️"
    }
  } else if (avgScore < -0.05) {
    return {
      title: "☁️ Slightly Defensive",
      tagline: "Mild negativity or caution circulating in recent thread titles.",
      theme: "negative",
      emoji: "🌤️"
    }
  }

  return {
    title: "⚖️ Balanced & Mixed Signals",
    tagline: "Neutral sentiment overall with balanced positive and negative commentary.",
    theme: "neutral",
    emoji: "☯️"
  }
}
