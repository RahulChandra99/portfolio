import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PageBackground from './PageBackground'
import Terminal from './components/Terminal'
import GitHubActivity from './components/GitHubActivity'
import useSyncedProjects from './useSyncedProjects'
import './styles.css'

// Separate chunk, so the Markdown parser only loads on the journal
const Journal = lazy(() => import('./JournalPage'))
const onJournal = window.location.pathname.startsWith('/journal')
import { profile, featured, experience, projects, filters } from './data'

const nav = [
  { href: '#top', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#work', label: 'Experience' },
  { href: '#contact', label: 'Connect' },
  { href: '#terminal', label: 'Terminal' },
]
// From the journal, section links go back to the home page
const navHref = href => (onJournal ? `/${href}` : href)

const categoryLabel = { unreal: 'Unreal', unity: 'Unity', tools: 'Tools', extensions: 'Chrome Extensions', apps: 'Apps', games: 'Games' }

// Initials on a tinted tile, for synced projects that have no screenshot yet
const initials = t => t.split(/\s+/).filter(w => /^[A-Za-z0-9]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')

function ExternalLink({ href, className, children, ...rest }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

function Icon({ name }) {
  return <span className="icon" style={{ '--icon': `url(/icons/${name}.svg)` }} aria-hidden="true" />
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <nav className="nav" aria-label="Main">
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
          <span className="visually-hidden">Menu</span>
        </button>
        <div id="nav-links" className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {nav.map(n => <a key={n.href} href={navHref(n.href)} target="_self">{n.label}</a>)}
          <a href="/journal" target="_self" className={onJournal ? 'active' : ''} aria-current={onJournal ? 'page' : undefined}>Journal</a>
          <ExternalLink href={profile.links.resume}>Resume</ExternalLink>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  const { links } = profile
  return (
    <section className="hero" id="top">
      <PageBackground />
      <div className="hero-inner">
        <img className="avatar" src={profile.avatar} alt={`Portrait of ${profile.name}`} width="168" height="168" />
        <h1>{profile.name}</h1>
        <p className="hero-role">Senior Game Programmer · C++ / C#</p>

        <p className="hero-intro">
          {profile.intro} Explore my <a href="#projects">personal projects</a> or
          see <a href="#work">where I've worked</a>.
        </p>

        <ul className="stack">
          {profile.techStack.map((t, n) => (
            <li key={t.name} style={{ '--n': n }}>
              <span className="stack-icon">
                {t.icon ? <Icon name={t.icon} /> : <span className="stack-text">{t.text}</span>}
              </span>
              <span className="stack-name">{t.name}</span>
            </li>
          ))}
        </ul>

        <div className="link-row">
          <ExternalLink href={links.github} className="btn btn-wide"><Icon name="github" /> GitHub</ExternalLink>
          <ExternalLink href={links.linkedin} className="btn btn-wide"><Icon name="linkedin" /> LinkedIn</ExternalLink>
          <ExternalLink href={links.youtube} className="btn btn-wide"><Icon name="youtube" /> YouTube</ExternalLink>
          <ExternalLink href={links.itch} className="btn btn-wide"><Icon name="itchdotio" /> itch.io</ExternalLink>
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ children, sub }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}

function Featured() {
  const f = featured
  return (
    <section className="section" id="featured">
      <SectionTitle>Currently working on</SectionTitle>
      <article className="feature" style={{ '--banner': `url(${f.banner || f.image})` }}>
        <div className="feature-body">
          <p className="feature-status">Now · {f.status}</p>
          <h3>{f.title}</h3>
          <p className="feature-role">{f.role} at {f.studio}</p>
          <p className="feature-summary">{f.summary}</p>
          <ul className="square-bullets">
            {f.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
          <ul className="pills">
            {f.tags.map(t => <li key={t}>{t}</li>)}
          </ul>
          <ExternalLink href={f.link.url} className="btn btn-blue btn-large">{f.link.label} ↗</ExternalLink>
        </div>
        <ExternalLink href={f.link.url} className="feature-capsule" aria-label={`${f.title} on Steam`}>
          <img src={f.image} alt={`${f.title} key art`} loading="lazy" />
        </ExternalLink>
      </article>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="work">
      <SectionTitle>Experience</SectionTitle>
      <ol className="timeline">
        {experience.map(job => (
          <li key={job.company} className="job">
            <div className="job-card">
              <p className="job-when">
                {job.dates} <span>· {job.place}</span>
              </p>
              <h3>{job.role}</h3>
              <p className="job-company">{job.company} <span>· {job.project}</span></p>
              <ul className="square-bullets">
                {job.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProjectCard({ project, index }) {
  return (
    <article className="card frame" style={{ '--i': index }}>
      <ExternalLink
        href={project.video || project.live || project.code}
        className="card-media"
        aria-label={`${project.video ? 'Watch demo of' : 'View'} ${project.title}`}
      >
        {project.image
          ? <img src={project.image} alt="" loading="lazy" />
          : <span className="card-placeholder" aria-hidden="true">{initials(project.title)}</span>}
        <span className="badges badges-overlay">
          <span className="badge badge-pink">Personal</span>
          <span className="badge">{categoryLabel[project.category]}</span>
        </span>
      </ExternalLink>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p className="muted small">{project.meta}</p>
        <p>{project.summary}</p>
        <ul className="bullets">
          {project.highlights.map(h => <li key={h}>{h}</li>)}
        </ul>
        <div className="card-actions">
          {project.live && <ExternalLink href={project.live} className="btn btn-blue">Try it</ExternalLink>}
          {project.video && <ExternalLink href={project.video} className="btn btn-blue"><Icon name="youtube" /> Demo</ExternalLink>}
          {project.code && <ExternalLink href={project.code} className="btn"><Icon name="github" /> Source</ExternalLink>}
        </div>
      </div>
    </article>
  )
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Projects() {
  const [filter, setFilter] = useState('all')
  // `shown` lags `filter` while the old cards animate out
  const [shown, setShown] = useState('all')
  const [leaving, setLeaving] = useState(false)
  const [indicator, setIndicator] = useState(null)
  const filtersRef = useRef(null)
  const timer = useRef(null)
  const synced = useSyncedProjects()
  const all = [...projects, ...synced]
  // Extra filter chips appear only when a synced repo brings a new category (e.g. Chrome Extensions)
  const chips = [...filters, ...[...new Set(synced.map(p => p.category))]
    .filter(id => !filters.some(f => f.id === id))
    .map(id => ({ id, label: categoryLabel[id] || id }))]
  const visible = shown === 'all' ? all : all.filter(p => p.category === shown)

  // Slide the highlight under whichever filter button is active
  useLayoutEffect(() => {
    const update = () => {
      const btn = filtersRef.current?.querySelector('[aria-pressed="true"]')
      if (btn) setIndicator({ x: btn.offsetLeft, y: btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight })
    }
    update()
    document.fonts?.ready.then(update)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [filter])

  useEffect(() => () => clearTimeout(timer.current), [])

  function choose(id) {
    if (id === filter) return
    setFilter(id)
    clearTimeout(timer.current)
    if (prefersReducedMotion()) return setShown(id)
    setLeaving(true)
    timer.current = setTimeout(() => {
      setShown(id)
      setLeaving(false)
    }, 200)
  }

  return (
    <section className="section" id="projects">
      <SectionTitle sub="Gameplay systems, tools and Chrome extensions, with demos and source on GitHub.">
        Projects
      </SectionTitle>
      <div className="filters" role="group" aria-label="Filter projects" ref={filtersRef}>
        {indicator && (
          <span
            className="filter-indicator"
            aria-hidden="true"
            style={{ width: indicator.w, height: indicator.h, transform: `translate(${indicator.x}px, ${indicator.y}px)` }}
          />
        )}
        {chips.map(f => (
          <button
            key={f.id}
            className={`btn btn-small filter-btn ${filter === f.id ? 'active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => choose(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={`card-grid ${leaving ? 'is-leaving' : ''}`}>
        {/* Keyed by filter so every card replays its entrance animation */}
        {visible.map((p, i) => <ProjectCard key={`${shown}:${p.title}`} project={p} index={i} />)}
      </div>
    </section>
  )
}

function GitHub() {
  return (
    <section className="section" id="github">
      <SectionTitle>GitHub</SectionTitle>
      <GitHubActivity user={profile.links.github.split('/').pop()} profileUrl={profile.links.github} />
    </section>
  )
}

function TerminalSection() {
  return (
    <section className="section" id="terminal">
      <SectionTitle sub="A small shell for poking around. Type help to see the commands.">
        Terminal
      </SectionTitle>
      <Terminal />
      <p className="terminal-tip">
        Tip: try <code>whoami</code>, <code>experience</code> or <code>sudo hire rahul</code>
      </p>
    </section>
  )
}

function Contact() {
  const { links } = profile
  return (
    <section className="section contact" id="contact">
      <SectionTitle>Connect</SectionTitle>
      <p className="contact-text">
        Open to chatting about roles and collaborations.
      </p>
      <div className="link-row">
        {links.email && <a href={`mailto:${links.email}`} className="btn btn-blue btn-wide"><Icon name="gmail" /> Email me</a>}
        <ExternalLink href={links.linkedin} className="btn btn-wide"><Icon name="linkedin" /> LinkedIn</ExternalLink>
        <ExternalLink href={links.resume} className="btn btn-wide">Resume</ExternalLink>
      </div>
    </section>
  )
}

export default function App() {
  if (onJournal) {
    return (
      <>
        <Header />
        <Suspense fallback={<main className="journal" />}>
          <Journal />
        </Suspense>
      </>
    )
  }
  return (
    <>
      <a href="#work" className="skip-link" target="_self">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <Featured />
        <Projects />
        <Experience />
        <GitHub />
        <Contact />
        <TerminalSection />
      </main>
    </>
  )
}
