# Build Prompt: "The Subreddit Vibe Check"

Use this as a spec to hand to a coding assistant (Claude, Cursor, Copilot, etc.) or to build the project yourself step by step.

---

## 1. Project Summary

Build a single-page web dashboard called **"The Subreddit Vibe Check"**. A user enters or selects a subreddit name. The app fetches the top 50 "Hot" posts from that subreddit's public JSON feed, runs a lightweight sentiment analysis on the post **titles**, and visualizes the overall mood of the subreddit.

No login, no backend, no database. 100% client-side.

---

## 2. Tech Stack

- **Framework:** React (functional components + hooks). Vite or Create React App both work; Vite is faster to set up.
- **Styling:** Plain CSS or Tailwind — your choice.
- **Charts (optional):** `recharts` or a hand-rolled SVG — a custom SVG "pulse line" is more visually distinctive than a generic bar chart.
- **Sentiment analysis:** client-side only, no server calls. Options:
  - `sentiment` (npm package, AFINN-based lexicon scorer) — easiest.
  - `vader-sentiment` — slightly better with negation/intensifiers, still lexicon-based.
  - A hand-rolled lexicon scorer (~150-word AFINN-style word list) if you want zero dependencies.
- **Hosting:** Vercel, Netlify, or GitHub Pages (all have free static-site tiers with a one-click deploy from a GitHub repo).

---

## 3. Data Fetching Requirements

**Endpoint:**
```
GET https://www.reddit.com/r/{subreddit}/hot.json?limit=50&raw_json=1
```

- No authentication is required for this endpoint — it's Reddit's public read-only JSON feed and works directly from a browser `fetch()` call (it returns permissive CORS headers).
- **Do not use the OAuth `/api/v1` endpoints** for this — those require registering an app and a token exchange, which is unnecessary complexity for reading public hot-post data. Save yourself the OAuth flow entirely.
- Parse `data.children[].data.title` from the response to get the 50 post titles.
- Also grab `data.children[].data.permalink`, `.ups`, and `.num_comments` — useful for a richer UI (link out to the post, show upvotes) even though only the title is required for sentiment.

**UI for input:**
- A text field where the user types a subreddit name (e.g. `technology`, `askreddit`, `wallstreetbets`).
- Optionally, a row of quick-select chips for a few popular subreddits.
- Handle and display errors gracefully: subreddit doesn't exist (404), private/banned subreddit (403), rate limiting (429), network failure.
- Show a loading state while the fetch is in flight.

---

## 4. Sentiment Analysis Requirements

For each of the 50 titles:
1. Lowercase and strip punctuation.
2. Tokenize into words.
3. Score using the lexicon (sum or average word scores).
4. Classify into **Positive / Neutral / Negative** using a threshold (e.g. average score > 0.15 → positive, < -0.15 → negative, else neutral).

Aggregate across all 50 posts:
- Count and percentage of Positive / Neutral / Negative posts.
- An overall "vibe" verdict derived from the aggregate (e.g. "Mostly Upbeat", "Mixed Signals", "Stormy").
- Optionally, an ordered sentiment trend (score per post in feed order) — good for a line/pulse chart showing how mood shifts across the 50 posts.

**Keep it simple** — this doesn't need to be state-of-the-art NLP. A lexicon-based scorer is exactly what's expected here.

---

## 5. Dashboard UI Requirements

At minimum, display:
- The subreddit name and total posts analyzed.
- Overall sentiment breakdown (counts + percentages), ideally as a stacked bar or donut.
- A verdict/headline summarizing the mood.
- The list of 50 titles, each tagged with its individual sentiment (color-coded: green/positive, gray/neutral, red/negative) and clickable through to the actual Reddit post (`https://reddit.com{permalink}`).

Nice-to-haves:
- A "pulse" visualization plotting sentiment score per post in feed order (literalizes the "vibe check" concept).
- Sort/filter controls (e.g. show only negative posts).
- Refresh button to re-fetch.

---

## 6. Deliverables

1. A public GitHub (or GitLab) repository with the full source code and a clear `README.md` explaining setup and how sentiment scoring works.
2. A live deployed link (Vercel/Netlify/GitHub Pages).
3. Clean commit history — a few incremental commits read much better to a reviewer than one giant commit.

---

## 7. Notes / Things to Double-Check Before Submitting

- Confirm the deployed app actually works with a fresh subreddit input (not just the one you tested locally) — Reddit occasionally returns different response shapes for quarantined or restricted subs.
- Handle subreddits with fewer than 50 hot posts (some small subs won't have 50).
- Don't hardcode a single subreddit — the requirement is that the user can input/select one.
- No account credentials, API keys, or personal data should be required to run or deploy this app — it should work for anyone who clones the repo.
