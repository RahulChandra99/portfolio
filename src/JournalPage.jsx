import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import useJournal from './useJournal'
import { timeAgo } from './lab'
import { profile } from './data'
import { JOURNAL_REPO, JOURNAL_DIR } from './journal'

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const LONG = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const fmt = (f, iso) => f.format(new Date(`${iso.slice(0, 10)}T12:00:00`))

// GitHub's colours for the languages that show up in my repos
const LANG = { 'C++': '#f34b7d', 'C#': '#178600', Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', ShaderLab: '#222c37' }

const KIND = { article: 'Article', commits: 'GitHub commits' }
const TABS = [
  { id: 'article', label: 'Articles' },
  { id: 'commits', label: 'GitHub commits' },
]
const PAGE = 15

// Images in blog/images/ are bundled at build time. One pushed later loads straight from GitHub.
const IMAGES = import.meta.glob('/blog/images/*', { as: 'url', eager: true })
function imageUrl(src) {
  if (!src || /^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) return src
  const path = src.replace(/^\.\//, '')
  return IMAGES[`/${JOURNAL_DIR}/${path}`] || `https://raw.githubusercontent.com/${JOURNAL_REPO}/main/${JOURNAL_DIR}/${path}`
}

const slugify = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Markdown to HTML, plus a table of contents from the h2/h3 headings
function renderBody(md) {
  const toc = []
  const html = marked.parse(md, { gfm: true, breaks: false })
    // Paragraphs that start with a time ("9:48 pm:" or "21:48 -") become log lines with the time in the gutter
    .replace(/<p>(\d{1,2}:\d{2}(?:\s?[ap]m)?)\s*[:\-–]\s*([\s\S]*?)<\/p>/gi,
      (_, t, rest) => `<p class="log"><time>${t.toLowerCase()}</time><span>${rest}</span></p>`)
    .replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
      const id = slugify(inner)
      toc.push({ id, level: +level, text: inner.replace(/<[^>]+>/g, '') })
      return `<h${level} id="${id}">${inner}</h${level}>`
    })
    .replace(/(<img[^>]*?src=")([^"]+)"/g, (_, pre, src) => `${pre}${imageUrl(src)}" loading="lazy"`)
  return { html, toc }
}

// First real paragraph as plain text, for list rows
function excerpt(post, n = 190) {
  if (post.summary) return post.summary
  const para = post.body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .find(p => p && !/^(#|!\[|>|\||-{3})/.test(p))
  if (!para) return ''
  const text = para
    .replace(/^\d{1,2}:\d{2}(\s?[ap]m)?\s*[:\-–]\s*/i, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
  return text.length > n ? `${text.slice(0, n).replace(/\s+\S*$/, '')}…` : text
}

function navigate(e, href) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}
const Link = ({ href, className, children, ...rest }) => (
  <a href={href} className={className} target="_self" onClick={e => navigate(e, href)} {...rest}>{children}</a>
)

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

function RepoChip({ repo }) {
  return (
    <a className="j-repo" href={repo.url} target="_blank" rel="noopener noreferrer">
      {repo.language && <span className="j-lang" style={{ '--lang': LANG[repo.language] || 'var(--dim)' }} />}
      <span className="j-repo-name">{repo.name}</span>
      {repo.pushed && <span className="j-repo-when">{timeAgo(repo.pushed)}</span>}
    </a>
  )
}

function Meta({ kind, date, minutes }) {
  return (
    <p className="b-meta">
      <span className={`b-kind is-${kind}`}>{KIND[kind]}</span>
      <time dateTime={date.slice(0, 10)}>{fmt(DATE, date)}</time>
      {minutes > 1 && <span>{minutes} min read</span>}
    </p>
  )
}

// Cover image, or a plain placeholder with the title when a post has none
function Cover({ post, className = '' }) {
  return post.cover
    ? <img className={`b-cover ${className}`} src={imageUrl(post.cover)} alt="" loading="lazy" />
    : (
      <div className={`b-cover b-cover-blank ${className}`} aria-hidden="true">
        <span>{post.category || KIND[post.type]}</span>
      </div>
    )
}

function Author({ date }) {
  return (
    <p className="b-author">
      <img src={profile.avatar} alt="" width="28" height="28" />
      <span>{profile.name}</span>
      {date && <><span className="b-dot" /><span>{fmt(DATE, date)}</span></>}
    </p>
  )
}

function Featured({ post }) {
  const href = `/dev-blog/${post.slug}`
  return (
    <Link href={href} className="b-featured">
      <Cover post={post} />
      <div className="b-featured-text">
        <Meta kind={post.type} date={post.date} minutes={post.minutes} />
        <h2>{post.title}</h2>
        <p>{excerpt(post, 260)}</p>
        <Author />
      </div>
    </Link>
  )
}

function PostRow({ post }) {
  const href = `/dev-blog/${post.slug}`
  return (
    <article className={`b-row ${post.cover ? 'has-cover' : ''}`}>
      <div className="b-row-text">
        <Meta kind={post.type} date={post.date} minutes={post.minutes} />
        <h3><Link href={href}>{post.title}</Link></h3>
        <p className="b-excerpt">{excerpt(post)}</p>
        {post.draft && <span className="j-draft">draft</span>}
      </div>
      {post.cover && <Link href={href} className="b-thumb" tabIndex={-1} aria-hidden="true"><img src={imageUrl(post.cover)} alt="" loading="lazy" /></Link>}
    </article>
  )
}

function CommitRow({ day }) {
  const [open, setOpen] = useState(false)
  const n = day.commits.length
  const shown = open ? day.commits : day.commits.slice(0, 3)
  return (
    <article className="b-row b-commits">
      <Meta kind="commits" date={day.date} />
      <p className="b-commit-title">
        <span className="j-commit-icon" aria-hidden="true" />
        Pushed {n} commit{n > 1 ? 's' : ''} to{' '}
        <a href={day.repo.url} target="_blank" rel="noopener noreferrer">{day.repo.name}</a>
      </p>
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

function Index({ posts, activity, params }) {
  const tag = params.get('tag')
  const [tab, setTab] = useState(() => (TABS.some(t => t.id === params.get('type')) ? params.get('type') : 'article'))
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)
  useEffect(() => setShown(PAGE), [tab, query, tag])
  useEffect(() => { if (tag) setTab('article') }, [tag])

  const q = query.trim().toLowerCase()
  const featured = !q && !tag && tab === 'article' ? posts[0] : null

  const items = useMemo(() => {
    const list = []
    if (tab === 'article') for (const p of posts) {
      if (p === featured) continue
      if (tag && !p.tags.includes(tag)) continue
      if (q && !`${p.title} ${p.summary} ${p.body} ${p.tags.join(' ')} ${p.category}`.toLowerCase().includes(q)) continue
      list.push({ key: p.slug, at: p.date.replace(' ', 'T'), post: p })
    }
    if (tab === 'commits') {
      for (const d of activity.days) {
        if (q && !`${d.repo.name} ${d.commits.map(c => c.subject).join(' ')}`.toLowerCase().includes(q)) continue
        list.push({ key: d.key, at: d.latest, day: d })
      }
    }
    return list.sort((a, b) => (a.at < b.at ? 1 : -1))
  }, [posts, activity, tab, tag, q, featured])

  const counts = { article: posts.length, commits: activity.days.length }

  return (
    <>
      <header className="b-head">
        <p className="b-eyebrow">Dev blog</p>
        <h1>Articles and GitHub commits</h1>
        <p>
          What I'm building in Unreal, Unity and C++, what broke along the way and how I fixed it.
          Commits from GitHub land here on their own.
        </p>
      </header>

      {featured && <Featured post={featured} />}

      <div className="b-toolbar">
        <div className="b-tabs" role="tablist" aria-label="Show">
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label} <span>{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <label className="b-search">
          <span className="sr-only">Search posts</span>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input type="search" placeholder="Search posts" value={query} onChange={e => setQuery(e.target.value)} />
        </label>
      </div>

      {tag && (
        <p className="j-active-filter">#{tag} <Link href="/dev-blog" className="j-clear">Clear</Link></p>
      )}

      <div className="b-list">
        {items.length === 0 && (
          <p className="j-empty">{q ? `Nothing matches "${query}".` : tab === 'article' ? 'No articles yet. The first one is on its way.' : 'Nothing here yet.'}</p>
        )}
        {items.slice(0, shown).map(e => (e.post ? <PostRow key={e.key} post={e.post} /> : <CommitRow key={e.key} day={e.day} />))}
      </div>
      {items.length > shown && (
        <button className="btn b-load" onClick={() => setShown(s => s + PAGE)}>Load more</button>
      )}
    </>
  )
}

function Single({ post, posts, repos }) {
  const { html, toc } = useMemo(() => renderBody(post.body), [post.body])
  const [copied, setCopied] = useState(false)
  const i = posts.indexOf(post)
  const older = posts[i + 1]
  const newer = posts[i - 1]
  const linked = post.repos.map(name => repos[name] || { name, url: `https://github.com/${JOURNAL_REPO.split('/')[0]}/${name}` })
  const copy = () => navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })

  return (
    <article className={`b-post is-${post.type}`}>
      <nav className="b-crumbs" aria-label="Breadcrumb">
        <Link href="/dev-blog">Dev blog</Link>
        <span aria-hidden="true">/</span>
        <Link href="/dev-blog">Articles</Link>
      </nav>
      {post.title && <h1>{post.title}</h1>}
      <div className="b-post-meta">
        <Author date={post.date} />
        {post.minutes > 1 && <span>{post.minutes} min read</span>}
        {post.draft && <span className="j-draft">draft</span>}
      </div>
      {post.cover && <img className="b-post-cover" src={imageUrl(post.cover)} alt="" />}

      <div className={`b-post-grid ${toc.length >= 2 ? 'has-toc' : ''}`}>
        <div>
          <div className="j-body b-prose" dangerouslySetInnerHTML={{ __html: html }} />
          {(post.building || post.mood || post.music) && (
            <footer className="j-meta">
              {post.building && <span><b>Currently building:</b>{post.building}</span>}
              {post.mood && <span><b>Current mood:</b>{post.mood}</span>}
              {post.music && <span><b>Current music:</b>{post.music}</span>}
            </footer>
          )}
        </div>
        <aside className="b-aside">
          {toc.length >= 2 && (
            <nav className="b-toc" aria-label="On this page">
              <h3>On this page</h3>
              {toc.map(t => <a key={t.id} href={`#${t.id}`} target="_self" className={`lvl-${t.level}`}>{t.text}</a>)}
            </nav>
          )}
          {linked.length > 0 && (
            <div>
              <h3>Repos</h3>
              <div className="j-repo-list">{linked.map(r => <RepoChip key={r.name} repo={r} />)}</div>
            </div>
          )}
          {post.tags.length > 0 && (
            <div>
              <h3>Tags</h3>
              <p className="j-tags">{post.tags.map(t => <Link key={t} href={`/dev-blog?tag=${encodeURIComponent(t)}`}>#{t}</Link>)}</p>
            </div>
          )}
          <button className="b-copy" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
        </aside>
      </div>

      <nav className="j-pager" aria-label="More posts">
        {older ? <Link href={`/dev-blog/${older.slug}`}><span>Older</span>{older.title}</Link> : <span />}
        {newer ? <Link href={`/dev-blog/${newer.slug}`} className="next"><span>Newer</span>{newer.title}</Link> : <span />}
      </nav>
    </article>
  )
}

export default function Journal() {
  const { posts, activity } = useJournal()
  const { path, params } = useRoute()
  const slug = decodeURIComponent(path.replace(/^\/dev-blog\/?/, '').replace(/\/$/, ''))
  const single = slug ? posts.find(p => p.slug === slug) : null
  const repos = useMemo(() => Object.fromEntries(activity.repos.map(r => [r.name, r])), [activity])

  useEffect(() => {
    document.title = single ? `${single.title} · Rahul Chandra` : 'Dev blog · Rahul Chandra'
  }, [single])

  return (
    <main className="journal">
      {single ? (
        <Single key={single.slug} post={single} posts={posts} repos={repos} />
      ) : slug ? (
        <div className="j-empty">
          <p>That post doesn't exist, or it hasn't synced yet.</p>
          <Link href="/dev-blog" className="j-back">Back to the dev blog</Link>
        </div>
      ) : (
        <Index posts={posts} activity={activity} params={params} />
      )}
    </main>
  )
}
