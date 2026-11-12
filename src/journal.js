// Dev journal: hand-written posts from journal/*.md plus commit activity pulled from GitHub.
// Shared by the build script (Node) and the browser, like lab.js.
import { GITHUB_USER } from './lab.js'

export const JOURNAL_REPO = `${GITHUB_USER}/portfolio`
export const JOURNAL_DIR = 'journal'

// Kept off the site entirely: no commits from these repos, and no commit that mentions them
const PRIVATE = ['shred-log']
const isPrivate = text => PRIVATE.some(p => String(text).toLowerCase().includes(p))
// Housekeeping commits that would just be noise in the feed
const NOISE = [/^Merge (branch|pull request)/, /^Refresh the synced projects snapshot/, /^Add files via upload$/]

const ACTIVITY_DAYS = 120
const ACTIVITY_REPOS = 8

// ---- Posts ----

// Frontmatter between --- lines: `key: value`, with [a, b] for lists
export function parsePost(name, text) {
  const slug = name.replace(/\.md$/, '')
  const meta = {}
  let body = text
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (m) {
    body = text.slice(m[0].length)
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*)$/)
      if (!kv) continue
      let v = kv[2].trim()
      if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
      else v = v.replace(/^['"]|['"]$/g, '')
      meta[kv[1]] = v
    }
  }
  const date = meta.date || slug.slice(0, 10)
  return {
    slug,
    title: meta.title || slug.slice(11).replace(/-/g, ' '),
    date,
    // "2026-11-12 21:48" sorts posts written on the same day
    sortKey: new Date(date.replace(' ', 'T')).getTime() || 0,
    tags: [].concat(meta.tags || []),
    repos: [].concat(meta.repos || []),
    mood: meta.mood || '',
    music: meta.music || '',
    building: meta.building || '',
    draft: meta.draft === 'true',
    body,
  }
}

// Git's blob hash, so the browser can tell which bundled posts changed on GitHub since the build
export async function gitBlobSha(text) {
  const bytes = new TextEncoder().encode(text)
  const head = new TextEncoder().encode(`blob ${bytes.length}\0`)
  const all = new Uint8Array(head.length + bytes.length)
  all.set(head)
  all.set(bytes, head.length)
  const hash = await crypto.subtle.digest('SHA-1', all)
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// Pull new or edited posts from GitHub. `bundled` maps file name -> raw text from the build.
export async function fetchPosts(bundled, fetchFn = fetch) {
  const res = await fetchFn(`https://api.github.com/repos/${JOURNAL_REPO}/contents/${JOURNAL_DIR}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const files = (await res.json()).filter(f => f.type === 'file' && /^\d{4}-\d{2}-\d{2}.*\.md$/.test(f.name))
  return Promise.all(files.map(async f => {
    const local = bundled[f.name]
    if (local != null && (await gitBlobSha(local)) === f.sha) return [f.name, local]
    const r = await fetchFn(f.download_url)
    return [f.name, r.ok ? await r.text() : local]
  })).then(pairs => Object.fromEntries(pairs.filter(([, t]) => t != null)))
}

// ---- GitHub activity ----

// Recent commits across my most recently pushed public repos, grouped into one entry per repo per day
export async function fetchActivity(fetchFn = fetch, token) {
  const headers = { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  const res = await fetchFn(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { headers })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const since = new Date(Date.now() - ACTIVITY_DAYS * 864e5).toISOString()
  const repos = (await res.json())
    .filter(r => !r.private && !r.fork && !isPrivate(r.name) && r.pushed_at > since)
    .slice(0, ACTIVITY_REPOS)

  const perRepo = await Promise.all(repos.map(async r => {
    try {
      const c = await fetchFn(`https://api.github.com/repos/${r.full_name}/commits?per_page=40&since=${since}&author=${GITHUB_USER}`, { headers })
      return c.ok ? (await c.json()).map(x => ({ repo: r, commit: x })) : []
    } catch { return [] }
  }))

  const groups = new Map()
  for (const { repo, commit } of perRepo.flat()) {
    const message = commit.commit.message
    const subject = message.split('\n')[0]
    if (isPrivate(message) || NOISE.some(rx => rx.test(subject))) continue
    const at = commit.commit.author.date
    const key = `${repo.name}@${at.slice(0, 10)}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        repo: repoSummary(repo),
        date: at.slice(0, 10),
        latest: at,
        commits: [],
      })
    }
    const g = groups.get(key)
    g.commits.push({ sha: commit.sha.slice(0, 7), subject, url: commit.html_url, at })
    if (at > g.latest) g.latest = at
  }
  return {
    repos: repos.map(repoSummary),
    days: [...groups.values()]
      .map(g => ({ ...g, commits: g.commits.sort((a, b) => (a.at < b.at ? 1 : -1)) }))
      .sort((a, b) => (a.latest < b.latest ? 1 : -1)),
  }
}

const repoSummary = r => ({
  name: r.name,
  url: r.html_url,
  description: r.description || '',
  language: r.language || '',
  stars: r.stargazers_count || 0,
  pushed: r.pushed_at,
})
