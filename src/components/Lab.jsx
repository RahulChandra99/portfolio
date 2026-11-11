import { useEffect, useMemo, useState } from 'react'
import snapshot from '../lab.json'
import { fetchLab, labCategories, timeAgo, GITHUB_USER, LAB_TOPIC } from '../lab'

const CACHE_KEY = 'lab:v1'
const CACHE_MS = 15 * 60 * 1000

// Starts from the snapshot baked in at build time, then quietly refreshes from GitHub.
function useLab() {
  const [items, setItems] = useState(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
      if (c && Date.now() - c.at < CACHE_MS) return c.items
    } catch {}
    return snapshot.items || []
  })
  useEffect(() => {
    let cancelled = false
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
      if (c && Date.now() - c.at < CACHE_MS) return
    } catch {}
    fetchLab()
      .then(live => {
        if (cancelled || !live.length) return
        setItems(live)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items: live })) } catch {}
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  return items
}

function LabCard({ item, index }) {
  const cat = labCategories.find(c => c.id === item.category) || labCategories[3]
  const main = item.live || item.video || item.code
  return (
    <article className="card frame lab-card" style={{ '--i': index }}>
      <a href={main} className="card-media" target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title}`}>
        {item.image
          ? <img src={item.image} alt="" loading="lazy" onError={e => e.currentTarget.replaceWith(Object.assign(document.createElement('span'), { className: 'lab-thumb', textContent: cat.icon }))} />
          : <span className="lab-thumb" aria-hidden="true">{cat.icon}</span>}
        <span className="badges badges-overlay">
          <span className="badge">{cat.label}</span>
        </span>
      </a>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p className="muted small">{item.repo}{item.updated ? ` · updated ${timeAgo(item.updated)}` : ''}</p>
        <p>{item.summary}</p>
        {item.highlights.length > 0 && (
          <ul className="bullets">
            {item.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
        )}
        {item.tags.length > 0 && (
          <ul className="pills lab-pills">
            {item.tags.map(t => <li key={t}>{t}</li>)}
          </ul>
        )}
        <div className="card-actions">
          {item.live && <a href={item.live} className="btn btn-blue" target="_blank" rel="noopener noreferrer">Try it ↗</a>}
          {item.video && <a href={item.video} className="btn btn-blue" target="_blank" rel="noopener noreferrer">Demo</a>}
          <a href={item.code} className="btn" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
      </div>
    </article>
  )
}

export default function Lab({ SectionTitle }) {
  const items = useLab()
  const [filter, setFilter] = useState('all')
  const cats = useMemo(() => labCategories.filter(c => items.some(i => i.category === c.id)), [items])
  const visible = filter === 'all' ? items : items.filter(i => i.category === filter)
  if (!items.length) return null
  return (
    <section className="section" id="lab">
      <SectionTitle sub="Side projects, extensions and experiments. This list updates itself from my GitHub.">
        Lab
      </SectionTitle>
      {cats.length > 1 && (
        <div className="filters lab-filters" role="group" aria-label="Filter lab projects">
          <button className={`btn btn-small filter-btn ${filter === 'all' ? 'active' : ''}`} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
          {cats.map(c => (
            <button key={c.id} className={`btn btn-small filter-btn ${filter === c.id ? 'active' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="card-grid lab-grid">
        {visible.map((it, i) => <LabCard key={`${filter}:${it.key}`} item={it} index={i} />)}
      </div>
      <p className="lab-foot muted small">
        Everything here is on <a href={`https://github.com/${GITHUB_USER}?tab=repositories&q=topic%3A${LAB_TOPIC}`} target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </section>
  )
}
