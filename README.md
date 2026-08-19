# 📡 The Subreddit Vibe Check

> A single-page web dashboard for real-time community sentiment analysis and mood visualization. Select or enter any public subreddit name to fetch the top 50 "Hot" posts, run client-side sentiment scoring on post titles, and visualize the overall community mood.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite)
![Sentiment Analysis](https://img.shields.io/badge/NLP-Client--Side-10b981)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **⚡ Real-time Reddit Data Fetching**: Fetches public JSON feeds directly via `https://www.reddit.com/r/{subreddit}/hot.json?limit=50&raw_json=1` (No backend, no OAuth key required).
- **🧠 Advanced Client-Side Sentiment Engine**: AFINN-165 + VADER inspired lexicon algorithm with negation handling ("not good"), booster multipliers ("super great"), and emoji sentiment support.
- **🌊 Vibe Trajectory Pulse Wave**: Hand-crafted interactive SVG line chart plotting post-by-post sentiment flow (#1 to #50) with interactive hover tooltips.
- **📊 Mood Distribution & Trigger Words**: Stacked proportion breakdown (Positive, Neutral, Negative %) alongside top positive and negative driver keyword chips.
- **🎯 Dynamic Vibe Verdict Banner**: Automated human-readable mood verdicts (e.g. *⚡ Energetically Upbeat*, *🌩️ Stormy & Cynical*, *⚖️ Calm & Informational*).
- **📱 Interactive Post Feed**: Filter by sentiment (All, Positive 🟢, Neutral ⚪, Negative 🔴), sort by score/upvotes/feed order, inline title keyword filter, and direct external Reddit links.
- **🎨 Sleek Dark Glassmorphism UI**: High-end design system with dark background, glowing CSS accents, skeleton loading states, and custom typography (Outfit & Plus Jakarta Sans).

---

## 🧠 How Sentiment Analysis Works

The application implements a 100% client-side natural language lexicon scorer built specifically for Reddit title text.

### 1. Preprocessing & Tokenization
Titles are tokenized using Unicode regex matching to isolate words, contractions (`don't`, `can't`), and emojis.

### 2. Lexicon Scoring & Rules
Each token is evaluated against a curated dictionary of weighted sentiment values (-5 to +5):
- **Modifiers & Intensifiers**: Words like `very`, `extremely`, `super`, `insanely` multiply the score of the subsequent sentiment word (e.g., `extremely good` = `+3 * 2.0 = +6`).
- **Negations**: Words like `not`, `no`, `never`, `without`, `don't` flip the polarity of subsequent sentiment words (e.g., `not great` = `-3 * 0.8 = -2.4`).
- **Emojis**: Emojis like 🚀, 🔥, 💖 carry positive weight while 😭, 📉, 💩, 😡 carry negative weight.

### 3. Score Normalization Formula
Title scores are normalized to a standard `-1.0` to `+1.0` scale using the VADER normalization formula:

$$ \text{Normalized Score} = \frac{x}{\sqrt{x^2 + \alpha}} $$

*(where $x$ is the sum of title token scores and $\alpha = 15$)*

### 4. Classification Thresholds
- **Positive 🟢**: Normalized score $\ge +0.15$
- **Neutral ⚪**: Normalized score between $-0.15$ and $+0.15$
- **Negative 🔴**: Normalized score $\le -0.15$

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js 18+ and npm installed.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/subreddit-vibe-check.git
   cd subreddit-vibe-check
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 One-Click Free Deployment

Because **The Subreddit Vibe Check** is a static single-page application with zero server dependencies, it can be deployed to any static host in under 1 minute:

### Vercel / Netlify
1. Push this repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set the build command to `npm run build` and output directory to `dist`.

---

## 📁 Repository Structure

```
subreddit-vibe-check/
├── index.html                   # HTML entry point with Google Fonts
├── package.json                 # Project configuration & dependencies
├── vite.config.js               # Vite bundler config
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Glassmorphism design tokens & styles
│   ├── services/
│   │   └── redditApi.js         # Reddit public JSON API client & error handling
│   ├── utils/
│   │   └── sentiment.js         # Lexicon engine & Vibe Verdict generator
│   └── components/
│       ├── Header.jsx           # App title & quick-select subreddit chips
│       ├── SearchBar.jsx        # Subreddit search bar & refresh button
│       ├── VibeSummary.jsx      # Top verdict banner & score index gauge
│       ├── VibePulseChart.jsx   # Custom SVG wave pulse chart
│       ├── SentimentDistribution.jsx # Proportional bar & trigger words cloud
│       ├── PostFeed.jsx         # Color-coded post list with filter/sort
│       └── ErrorMessage.jsx     # Helpful error states (404/403/429)
└── README.md                    # Project documentation
```

---

## 📄 License
MIT © 2026 Subreddit Vibe Check
