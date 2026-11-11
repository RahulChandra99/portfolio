// The Lab: side projects pulled from GitHub.
// Any repo tagged with the `portfolio` topic that has a portfolio.json at its root shows up here.
// portfolio.json: { "category": "extensions", "items": [{ title, path, summary, highlights, tags, image, video, live, category }] }
// A single-project repo can skip "items" and put those fields at the top level.

export const GITHUB_USER = 'RahulChandra99'
export const LAB_TOPIC = 'portfolio'

export const labCategories = [
  { id: 'extensions', label: 'Chrome extensions', icon: '🧩' },
  { id: 'apps', label: 'Apps & web', icon: '📱' },
  { id: 'games', label: 'Games & prototypes', icon: '🎮' },
  { id: 'tools', label: 'Tools', icon: '🛠️' },
]

const known = new Set(labCategories.map(c => c.id))
const alias = { extension: 'extensions', chrome: 'extensions', app: 'apps', web: 'apps', game: 'games', unity: 'games', unreal: 'games', tool: 'tools' }
const catOf = c => {
  const k = String(c || '').toLowerCase()
  return known.has(k) ? k : alias[k] || 'tools'
}

// Turn one repo + its portfolio.json into cards
export function toItems(repo, file) {
  const branch = repo.default_branch || 'main'
  const raw = p => (/^https?:\/\//.test(p) ? p : `https://raw.githubusercontent.com/${repo.full_name}/${branch}/${String(p).replace(/^\.?\//, '')}`)
  const list = Array.isArray(file?.items) ? file.items : [file || {}]
  return list
    .filter(it => it && (it.title || repo.name))
    .map(it => ({
      key: `${repo.full_name}/${it.path || ''}/${it.title || ''}`,
      title: it.title || repo.name,
      category: catOf(it.category || file?.category),
      summary: it.summary || repo.description || '',
      highlights: Array.isArray(it.highlights) ? it.highlights.slice(0, 4) : [],
      tags: Array.isArray(it.tags) ? it.tags.slice(0, 5) : [],
      image: it.image ? raw(it.image) : null,
      video: it.video || null,
      live: it.live || null,
      code: it.path ? `${repo.html_url}/tree/${branch}/${it.path}` : repo.html_url,
      repo: repo.name,
      updated: repo.pushed_at,
      status: it.status || 'active',
    }))
    .filter(it => it.status !== 'hidden')
}

// Shared by the build script (Node) and the browser
export async function fetchLab(fetchFn = fetch, token) {
  const headers = { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  const res = await fetchFn(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { headers })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const repos = (await res.json()).filter(r => !r.private && !r.archived && (r.topics || []).includes(LAB_TOPIC))
  const files = await Promise.all(repos.map(async r => {
    try {
      const f = await fetchFn(`https://raw.githubusercontent.com/${r.full_name}/${r.default_branch || 'main'}/portfolio.json`)
      return f.ok ? await f.json() : null
    } catch { return null }
  }))
  return repos.flatMap((r, i) => toItems(r, files[i]))
}

export function timeAgo(iso) {
  if (!iso) return ''
  const d = Math.floor((Date.now() - new Date(iso)) / 864e5)
  if (d < 1) return 'today'
  if (d < 2) return 'yesterday'
  if (d < 30) return `${d} days ago`
  const m = Math.floor(d / 30)
  return m < 12 ? `${m} month${m > 1 ? 's' : ''} ago` : `${Math.floor(m / 12)}y ago`
}
