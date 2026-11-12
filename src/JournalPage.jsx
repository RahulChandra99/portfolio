import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import useJournal from './useJournal'
import { timeAgo } from './lab'
import { profile } from './data'

const DAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const MONTH = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })
const CLOCK = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })

const dayLabel = iso => DAY.format(new Date(`${iso.slice(0, 10)}T12:00:00`))
const clock = iso => (/\d{2}:\d{2}/.test(iso) ? CLOCK.format(new Date(iso.replace(' ', 'T'))).toLowerCase() : '')

// GitHub's colours for the languages that show up in my repos
const LANG = { 'C++': '#f34b7d', 'C#': '#178600', Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', ShaderLab: '#222c37' }

// Paragraphs that start with a time ("9:48 pm:" or "21:48 -") become log lines with the time in the gutter
function renderBody(md) {
  return marked.parse(md, { gfm: true, breaks: false }).replace(
    /<p>(\d{1,2}:\d{2}(?:\s?[ap]m)?)\s*[:\-–]\s*([\s\S]*?)<\/p>/gi,
    (_, t, rest) => `<p class="log"><time>${t.toLowerCase()}</time><span>${rest}</span></p>`
  )
}

function navigate(e, href) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

function RepoChip({ repo }) {
  return (
    <a className="j-repo" href={repo.url} target="_blank" rel="noopener noreferrer">
      {repo.language && <span className="j-lang" style={{ '--lang': LANG[repo.language] || 'var(--dim)' }} />}
      <span className="j-repo-name">{repo.name}</span>
      {repo.pushed && <span className="j-repo-when">pushed {timeAgo(repo.pushed)}</span>}
    </a>
  )
}

function Post({ post, repos, full }) {
  const html = useMemo(() => renderBody(post.body), [post.body])
  const href = `/blog/${post.slug}`
  const linked = post.repos.map(name => repos[name] || { name, url: `https://github.com/${profile.links.github.split('/').pop()}/${name}` })
  return (
    <article className={`j-entry j-post ${full ? 'is-full' : ''}`}>
      <header className="j-post-head">
        {clock(post.date) && <time className="j-time">{clock(post.date)}</time>}
        <h2>{full ? post.title : <a href={href} target="_self" onClick={e => navigate(e, href)}>{post.title}</a>}</h2>
        {post.draft && <span className="j-draft">draft</span>}
      </header>
      <div className="j-body" dangerouslySetInnerHTML={{ __html: html }} />
      {linked.length > 0 && (
        <div className="j-repos">
          {linked.map(r => <RepoChip key={r.name} repo={r} />)}
        </div>
      )}
      {(post.mood || post.music || post.building || post.tags.length > 0) && (
        <footer className="j-meta">
          {post.building && <span><b>building</b> {post.building}</span>}
          {post.mood && <span><b>mood</b> {post.mood}</span>}
          {post.music && <span><b>listening to</b> {post.music}</span>}
          {post.tags.length > 0 && (
            <span className="j-tags">
              {post.tags.map(t => (
                <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} target="_self" onClick={e => navigate(e, `/blog?tag=${encodeURIComponent(t)}`)}>#{t}</a>
              ))}
            </span>
          )}
        </footer>
      )}
    </article>
  )
}

function Commits({ day }) {
  const [open, setOpen] = useState(false)
  const shown = open ? day.commits : day.commits.slice(0, 3)
  const n = day.commits.length
  return (
    <article className="j-entry j-commits">
      <header className="j-commit-head">
        <time className="j-time">{clock(day.latest)}</time>
        <span className="j-commit-icon" aria-hidden="true" />
        <p>
          Pushed {n} commit{n > 1 ? 's' : ''} to{' '}
          <a href={day.repo.url} target="_blank" rel="noopener noreferrer">{day.repo.name}</a>
        </p>
      </header>
      <ul className="j-commit-list">
        {shown.map(c => (
          <li key={c.sha}>
            <a href={c.url} target="_blank" rel="noopener noreferrer"><code>{c.sha}</code></a>
            <span>{c.subject}</span>
          </li>
        ))}
      </ul>
      {n > 3 && (
        <button className="j-more" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? 'Show less' : `Show ${n - 3} more`}
        </button>
      )}
    </article>
  )
}

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'posts', label: 'Notes' },
  { id: 'commits', label: 'Commits' },
]

function useRoute() {
  const read = () => ({ path: window.location.pathname, params: new URLSearchParams(window.location.search) })
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  return route
}

export default function Journal() {
  const { posts, activity } = useJournal()
  const { path, params } = useRoute()
  const [filter, setFilter] = useState('all')
  const slug = decodeURIComponent(path.replace(/^\/blog\/?/, '').replace(/\/$/, ''))
  const tag = params.get('tag')
  const month = params.get('month')

  const repos = useMemo(() => Object.fromEntries(activity.repos.map(r => [r.name, r])), [activity])
  const latest = posts[0]

  useEffect(() => {
    const p = slug && posts.find(x => x.slug === slug)
    document.title = p ? `${p.title} · Rahul's blog` : "Rahul's blog"
  }, [slug, posts])

  // Posts and commit days, newest first, grouped under a date heading
  const entries = useMemo(() => {
    const list = []
    if (filter !== 'commits') {
      for (const p of posts) {
        if (tag && !p.tags.includes(tag)) continue
        list.push({ kind: 'post', at: p.date.replace(' ', 'T'), day: p.date.slice(0, 10), post: p })
      }
    }
    if (filter !== 'posts' && !tag) {
      for (const d of activity.days) list.push({ kind: 'commits', at: d.latest, day: d.date, data: d })
    }
    return list
      .filter(e => !month || e.day.startsWith(month))
      .sort((a, b) => (a.at < b.at ? 1 : -1))
  }, [posts, activity, filter, tag, month])

  const days = useMemo(() => {
    const out = []
    for (const e of entries) {
      if (out.at(-1)?.day !== e.day) out.push({ day: e.day, items: [] })
      out.at(-1).items.push(e)
    }
    return out
  }, [entries])

  const months = useMemo(() => {
    const counts = {}
    for (const p of posts) counts[p.date.slice(0, 7)] = (counts[p.date.slice(0, 7)] || 0) + 1
    for (const d of activity.days) counts[d.date.slice(0, 7)] = (counts[d.date.slice(0, 7)] || 0) + 1
    return Object.entries(counts).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [posts, activity])

  const tags = useMemo(() => {
    const counts = {}
    for (const p of posts) for (const t of p.tags) counts[t] = (counts[t] || 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [posts])

  const single = slug ? posts.find(p => p.slug === slug) : null
  const index = single ? posts.indexOf(single) : -1
  const link = (href, label, cls) => <a href={href} className={cls} target="_self" onClick={e => navigate(e, href)}>{label}</a>

  return (
    <main className="journal">
      <div className="j-layout">
        <aside className="j-side">
          <div className="j-card j-profile">
            <img src={profile.avatar} alt="" width="56" height="56" />
            <div>
              <p className="j-name">{profile.name}</p>
              <p className="j-handle">blog · {profile.location}</p>
            </div>
          </div>
          {latest && (latest.building || latest.mood) && (
            <div className="j-card j-now">
              {latest.building && <p><b>Building</b>{latest.building}</p>}
              {latest.mood && <p><b>Mood</b>{latest.mood}</p>}
            </div>
          )}
          {activity.repos.length > 0 && (
            <div className="j-card">
              <h3>Recently pushed</h3>
              <div className="j-repo-list">
                {activity.repos.slice(0, 5).map(r => <RepoChip key={r.name} repo={r} />)}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div className="j-card">
              <h3>Tags</h3>
              <p className="j-tag-cloud">
                {tags.map(([t, n]) => (
                  <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} target="_self" className={t === tag ? 'active' : ''}
                    onClick={e => navigate(e, `/blog?tag=${encodeURIComponent(t)}`)}>#{t} <span>{n}</span></a>
                ))}
              </p>
            </div>
          )}
          {months.length > 0 && (
            <div className="j-card">
              <h3>Archive</h3>
              <ul className="j-archive">
                {months.map(([m, n]) => (
                  <li key={m}>
                    {link(`/blog?month=${m}`, <>{MONTH.format(new Date(`${m}-15T12:00:00`))} <span>{n}</span></>, m === month ? 'active' : '')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="j-main">
          {single ? (
            <>
              {link('/blog', '← All entries', 'j-back')}
              <p className="j-day">{dayLabel(single.date)}</p>
              <Post post={single} repos={repos} full />
              <nav className="j-pager" aria-label="More entries">
                {posts[index + 1] ? link(`/blog/${posts[index + 1].slug}`, <><span>Older</span>{posts[index + 1].title}</>) : <span />}
                {posts[index - 1] ? link(`/blog/${posts[index - 1].slug}`, <><span>Newer</span>{posts[index - 1].title}</>, 'next') : <span />}
              </nav>
            </>
          ) : slug ? (
            <div className="j-empty">
              <p>That entry doesn't exist, or it hasn't synced yet.</p>
              {link('/blog', '← All entries', 'j-back')}
            </div>
          ) : (
            <>
              <header className="j-top">
                <h1>Blog</h1>
                <p>Notes, ideas and progress as I build. Commits from GitHub show up here on their own.</p>
              </header>
              <div className="j-toolbar">
                <div className="j-filters" role="group" aria-label="Show">
                  {FILTERS.map(f => (
                    <button key={f.id} className={filter === f.id ? 'active' : ''} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                      {f.label}
                    </button>
                  ))}
                </div>
                {(tag || month) && (
                  <p className="j-active-filter">
                    {tag ? `#${tag}` : MONTH.format(new Date(`${month}-15T12:00:00`))}
                    {link('/blog', 'Clear', 'j-clear')}
                  </p>
                )}
              </div>
              {days.length === 0 && <p className="j-empty">Nothing here yet.</p>}
              {days.map(d => (
                <section key={d.day} className="j-daygroup">
                  <h2 className="j-day">{dayLabel(d.day)}</h2>
                  {d.items.map(e =>
                    e.kind === 'post'
                      ? <Post key={e.post.slug} post={e.post} repos={repos} />
                      : <Commits key={e.data.key} day={e.data} />
                  )}
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
