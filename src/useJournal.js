import { useEffect, useState } from 'react'
import activitySnapshot from './activity.json'
import { fetchActivity, fetchPosts, parsePost } from './journal'

// Posts bundled at build time, keyed by file name
const bundled = Object.fromEntries(
  Object.entries(import.meta.glob('/blog/*.md', { as: 'raw', eager: true }))
    .map(([path, text]) => [path.split('/').pop(), text])
)

const CACHE_MS = 15 * 60 * 1000
function cached(key) {
  try {
    const c = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (c && Date.now() - c.at < CACHE_MS) return c.data
  } catch {}
  return null
}
function store(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })) } catch {}
}

const mergeDays = (live, old) => {
  const seen = new Set(live.map(d => d.key))
  return [...live, ...old.filter(d => !seen.has(d.key))].sort((a, b) => (a.latest < b.latest ? 1 : -1))
}

const toPosts = files =>
  Object.entries(files)
    .map(([name, text]) => parsePost(name, text))
    .filter(p => import.meta.env.DEV || !p.draft)
    .sort((a, b) => b.sortKey - a.sortKey)

// Starts from what was baked in at build time, then refreshes from GitHub once per visit
// (cached for 15 minutes), so a pushed post or commit shows up without a redeploy.
export default function useJournal() {
  const [files, setFiles] = useState(() => cached('blog:posts:v1') || bundled)
  const [activity, setActivity] = useState(() => cached('blog:activity:v1') || activitySnapshot)

  useEffect(() => {
    let cancelled = false
    // In dev the local blog/ folder is the source of truth, including unpushed drafts
    if (!import.meta.env.DEV && !cached('blog:posts:v1')) {
      fetchPosts(bundled)
        .then(f => { if (!cancelled) { setFiles(f); store('blog:posts:v1', f) } })
        .catch(() => {})
    }
    if (!cached('blog:activity:v1')) {
      fetchActivity()
        .then(a => {
          if (cancelled || !a.days.length) return
          // A rate-limited repo comes back empty, so keep its days from the snapshot
          const merged = { repos: a.repos, days: mergeDays(a.days, activitySnapshot.days) }
          setActivity(merged)
          store('blog:activity:v1', merged)
        })
        .catch(() => {})
    }
    return () => { cancelled = true }
  }, [])

  return { posts: toPosts(files), activity }
}
