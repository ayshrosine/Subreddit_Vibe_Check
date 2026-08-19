/**
 * Client-Side Sentiment Analysis Engine
 * Enhanced AFINN-165 + VADER Lexicon with word stemming, negation handling, boosters, and emojis.
 */

// Lexicon dictionary: base word -> score (-5 to +5)
const LEXICON = {
  // --- POSITIVE WORDS ---
  // Ultra Positive (+4 to +5)
  'awesome': 4, 'superb': 5, 'outstanding': 5, 'breathtaking': 5, 'masterpiece': 5,
  'triumph': 4, 'thrilled': 4, 'phenomenal': 5, 'legendary': 5, 'spectacular': 4,
  'flawless': 5, 'brilliant': 4, 'wholesome': 4, 'bullish': 4, 'breakthrough': 4,
  'cheers': 3, 'inspirational': 4, 'glorious': 4, 'victory': 4, 'winner': 4,
  'revolutionary': 4, 'miracle': 4, 'jackpot': 4, 'hero': 4, 'paradise': 4,

  // Positive (+2 to +3)
  'good': 2, 'great': 3, 'love': 3, 'happy': 3, 'best': 3, 'amazing': 3, 'excellent': 3,
  'nice': 2, 'cool': 2, 'fun': 2, 'beautiful': 3, 'solid': 2, 'enjoy': 2, 'enjoyable': 2,
  'helpful': 2, 'impressive': 3, 'favorite': 3, 'favourite': 3, 'hope': 2, 'hopeful': 2,
  'success': 3, 'successful': 3, 'boost': 2, 'win': 3, 'winning': 3, 'gain': 2, 'growth': 2,
  'excited': 3, 'exciting': 3, 'sweet': 2, 'wonderful': 3, 'perfect': 3, 'strong': 2,
  'smart': 2, 'clever': 2, 'creative': 2, 'upgrade': 2, 'pro': 2, 'innovative': 3,
  'recommend': 2, 'reward': 2, 'worth': 2, 'upvote': 2, 'clarity': 2, 'peace': 2,
  'benefit': 2, 'benefits': 2, 'beneficial': 3, 'solution': 2, 'solutions': 2, 'fix': 2, 'fixed': 2,
  'cure': 3, 'cured': 3, 'safe': 2, 'safety': 2, 'healthy': 2, 'healthier': 2,
  'rise': 2, 'rises': 2, 'rising': 2, 'soar': 3, 'soars': 3, 'soaring': 3, 'surge': 3, 'surges': 3,
  'launch': 2, 'launches': 2, 'launched': 2, 'release': 2, 'released': 2, 'unveil': 2, 'unveiled': 2,
  'discovery': 3, 'discover': 2, 'discovered': 2, 'advance': 2, 'advancement': 3, 'advancements': 3,
  'profit': 3, 'profits': 3, 'profitable': 3, 'opportunity': 2, 'opportunities': 2, 'promising': 3,
  'save': 2, 'saves': 2, 'saved': 2, 'saving': 2, 'cheaper': 2, 'deal': 2, 'deals': 2, 'free': 2,
  'bonus': 2, 'gift': 2, 'gifts': 2, 'protect': 2, 'protects': 2, 'protected': 2, 'shield': 2,
  'record': 2, 'top': 2, 'better': 2, 'improvement': 2, 'improvements': 2, 'clean': 2, 'easy': 2,

  // Mildly Positive (+1)
  'plus': 1, 'like': 1, 'yes': 1, 'interested': 1, 'cute': 1, 'fair': 1,
  'valid': 1, 'agree': 1, 'care': 1, 'friend': 1, 'kind': 1, 'fresh': 1, 'new': 1,
  'update': 1, 'feature': 1, 'featured': 1, 'ready': 1, 'open': 1,

  // --- NEGATIVE WORDS ---
  // Mildly Negative (-1)
  'slow': -1, 'odd': -1, 'weird': -1, 'hard': -1, 'doubt': -1, 'risk': -1, 'risky': -1,
  'confused': -1, 'tiring': -1, 'busy': -1, 'costly': -1, 'lost': -1, 'late': -1,
  'delay': -1, 'delayed': -1, 'delays': -1, 'concern': -1, 'concerns': -1,

  // Negative (-2 to -3)
  'bad': -2, 'worst': -3, 'hate': -3, 'sad': -2, 'poor': -2, 'ugly': -2, 'angry': -3,
  'annoying': -2, 'bother': -2, 'fail': -2, 'failed': -2, 'failure': -3, 'fault': -2,
  'wrong': -2, 'terrible': -3, 'horrible': -3, 'awful': -3, 'boring': -2, 'scam': -3,
  'fake': -2, 'pain': -2, 'painful': -2, 'scared': -2, 'scary': -2, 'afraid': -2,
  'fear': -2, 'lose': -2, 'losing': -2, 'loss': -2, 'drop': -2, 'drops': -2, 'dropped': -2,
  'crash': -3, 'crashed': -3, 'crashes': -3, 'bearish': -3, 'broken': -2, 'harm': -2, 'hurt': -2,
  'problem': -2, 'issue': -2, 'issues': -2, 'crisis': -3, 'danger': -2, 'dangerous': -2,
  'dump': -2, 'dumping': -2, 'ruin': -3, 'ruined': -3, 'complaint': -2, 'sucks': -3,
  'trash': -3, 'garbage': -3, 'stupid': -3, 'dumb': -3, 'bug': -2, 'bugs': -2,
  'ban': -2, 'banned': -2, 'bans': -2, 'die': -3, 'dies': -3, 'dead': -3, 'death': -3,
  'threat': -2, 'threats': -2, 'warn': -2, 'warns': -2, 'warned': -2, 'warning': -2, 'warnings': -2,
  'attack': -3, 'attacks': -3, 'attacked': -3, 'hack': -3, 'hacks': -3, 'hacked': -3, 'hacker': -3,
  'exploit': -3, 'exploits': -3, 'exploited': -3, 'vulnerability': -3, 'vulnerabilities': -3,
  'breach': -3, 'breached': -3, 'steal': -3, 'steals': -3, 'stolen': -3, 'shut': -2, 'shutdown': -3,
  'cancel': -2, 'canceled': -2, 'cancelled': -2, 'sued': -2, 'lawsuit': -2, 'fine': -2, 'fined': -2,
  'fines': -2, 'strike': -2, 'clash': -2, 'layoff': -3, 'layoffs': -3, 'fire': -2, 'fired': -2,
  'cut': -2, 'cuts': -2, 'damage': -2, 'damages': -2, 'damaged': -2, 'struggle': -2, 'struggles': -2,
  'alarm': -2, 'alarming': -2, 'plunge': -3, 'plunged': -3, 'slump': -2, 'cheat': -3, 'flaw': -2,
  'flaws': -2, 'error': -2, 'errors': -2, 'investigation': -2, 'probe': -2, 'charge': -2, 'charges': -2,
  'arrest': -3, 'arrested': -3, 'crime': -3, 'criminal': -3, 'leaked': -1, 'leak': -1, 'leaks': -1,

  // Ultra Negative (-4 to -5)
  'disaster': -4, 'devastating': -4, 'tragic': -4, 'tragedy': -4, 'horrific': -5,
  'outrage': -4, 'outraged': -4, 'disgusting': -4, 'evil': -4, 'corrupt': -4, 'corruption': -4,
  'catastrophe': -5, 'atrocious': -5, 'fatal': -4, 'deadly': -4, 'kill': -4, 'killed': -4,
  'destroy': -4, 'destroys': -4, 'destroyed': -4, 'destruction': -4, 'abusive': -4, 'nightmare': -4, 'fraud': -4,

  // Emojis
  '🚀': 4, '🔥': 3, '❤️': 3, '💖': 3, '😍': 3, '🥰': 3, '😊': 2, '😄': 2, '👍': 2,
  '💯': 3, '🎉': 3, '✨': 2, '📈': 3, '🙌': 2, '💪': 2, '⭐': 2, '🏆': 3,
  '😭': -2, '💔': -3, '😡': -3, '🤬': -4, '🤮': -4, '💩': -3, '📉': -3, '👎': -2,
  '💀': -2, '⚠️': -2, '🤡': -2, '🥀': -2, '🤦': -2
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
  'crazy': 1.4,
  'major': 1.4,
  'massive': 1.6,
  'huge': 1.6,
  'giant': 1.4
}

/**
 * Tokenize string into lowercase words and emojis
 */
export function tokenize(text) {
  if (!text) return []
  const cleanText = text.toLowerCase()
  const tokens = cleanText.match(/[\p{L}\p{N}'’]+|[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []
  return tokens
}

/**
 * Helper to stem words if not directly in lexicon
 */
function getStemmedWord(word) {
  if (LEXICON.hasOwnProperty(word)) return word
  
  // Try removing 's', 'ed', 'ing'
  if (word.endsWith('s') && LEXICON.hasOwnProperty(word.slice(0, -1))) {
    return word.slice(0, -1)
  }
  if (word.endsWith('ed') && LEXICON.hasOwnProperty(word.slice(0, -2))) {
    return word.slice(0, -2)
  }
  if (word.endsWith('ing') && LEXICON.hasOwnProperty(word.slice(0, -3))) {
    return word.slice(0, -3)
  }
  return null
}

/**
 * Analyze sentiment of a single post title
 */
export function analyzeTitle(title) {
  const tokens = tokenize(title)
  if (tokens.length === 0) {
    return { rawScore: 0, normalizedScore: 0, sentiment: 'neutral', triggerWords: { positive: [], negative: [] } }
  }

  let totalScore = 0
  let matchedCount = 0
  const positiveWords = []
  const negativeWords = []

  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i].replace(/^['’]+|['’]+$/g, '')
    const matchedToken = getStemmedWord(rawToken) || (LEXICON.hasOwnProperty(tokens[i]) ? tokens[i] : null)
    
    if (matchedToken) {
      let score = LEXICON[matchedToken]

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
        score = -score * 0.85
      } else {
        score = score * booster
      }

      totalScore += score
      matchedCount++

      if (score > 0) {
        positiveWords.push(rawToken)
      } else if (score < 0) {
        negativeWords.push(rawToken)
      }
    }
  }

  // VADER normalization formula: x / sqrt(x^2 + alpha)
  const alpha = 10
  const normalizedScore = matchedCount === 0 
    ? 0 
    : Math.max(-1, Math.min(1, totalScore / Math.sqrt(Math.pow(totalScore, 2) + alpha)))

  // Sensitive classification threshold
  let sentiment = 'neutral'
  if (normalizedScore > 0.05 || totalScore > 0) {
    sentiment = 'positive'
  } else if (normalizedScore < -0.05 || totalScore < 0) {
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
  if (posPct >= 45) {
    return {
      title: "⚡ Energetically Upbeat",
      tagline: "High optimism! The community is overwhelming positive and enthusiastic.",
      theme: "positive",
      emoji: "🚀"
    }
  }
  if (posPct >= 30 && negPct < 20) {
    return {
      title: "💖 Wholesome & Positive",
      tagline: "Warm vibes dominate with plenty of supportive, cheerful discussions.",
      theme: "positive",
      emoji: "✨"
    }
  }
  if (negPct >= 40) {
    return {
      title: "🌧️ Deeply Gloomy",
      tagline: "High cynicism and frustration. Negative posts outweigh constructive ones.",
      theme: "negative",
      emoji: "🌩️"
    }
  }
  if (negPct >= 25 && posPct < 25) {
    return {
      title: "🔥 Heated & Critical",
      tagline: "Tension in the air! Community members are vocal about flaws and issues.",
      theme: "negative",
      emoji: "💢"
    }
  }
  if (posPct >= 25 && negPct >= 25) {
    return {
      title: "⚡ High Energy Debate",
      tagline: "Strong Opinions! Sharp mix of passionate praises and intense critiques.",
      theme: "mixed",
      emoji: "🤼"
    }
  }
  
  if (avgScore > 0.03) {
    return {
      title: "🌱 Mildly Optimistic",
      tagline: "Slightly positive lean with a healthy mix of balanced discussion.",
      theme: "positive",
      emoji: "☀️"
    }
  } else if (avgScore < -0.03) {
    return {
      title: "☁️ Slightly Defensive",
      tagline: "Mild negativity or caution circulating in recent thread titles.",
      theme: "negative",
      emoji: "🌤️"
    }
  }

  return {
    title: "⚖️ Calm & Informational",
    tagline: "Mostly news, queries, and neutral discussions without heavy emotional bias.",
    theme: "neutral",
    emoji: "📊"
  }
}
