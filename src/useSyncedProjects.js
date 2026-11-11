import { useEffect, useState } from 'react'
import snapshot from './lab.json'
import { fetchLab } from './lab'

const CACHE_KEY = 'synced-projects:v1'
const CACHE_MS = 15 * 60 * 1000

function cached() {
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (c && Date.now() - c.at < CACHE_MS) return c.items
  } catch {}
  return null
}

// Same shape as the hand-written entries in data.js, so ProjectCard can show both
const toProject = it => ({
  title: it.title,
  category: it.category,
  meta: it.tags.slice(0, 3).join(' · '),
  summary: it.summary,
  highlights: it.highlights,
  tags: it.tags,
  image: it.image,
  video: it.video,
  live: it.live,
  code: it.code,
  synced: true,
})

// Projects from GitHub repos tagged `portfolio`. Starts from the snapshot baked in at
// build time, then refreshes from GitHub once per visit (cached for 15 minutes).
export default function useSyncedProjects() {
  const [items, setItems] = useState(() => cached() || snapshot.items || [])
  useEffect(() => {
    if (cached()) return
    let cancelled = false
    fetchLab()
      .then(live => {
        if (cancelled || !live.length) return
        setItems(live)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items: live })) } catch {}
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  return items.map(toProject)
}
