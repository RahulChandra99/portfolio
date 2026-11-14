import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Terminal from './components/Terminal'
import GitHubActivity from './components/GitHubActivity'
import useSyncedProjects from './useSyncedProjects'
import './styles.css'

// Separate chunk, so the Markdown parser only loads on the blog
const Journal = lazy(() => import('./JournalPage'))
const onJournal = window.location.pathname.startsWith('/dev-blog')
import { profile, featured, experience, projects, filters } from './data'

const nav = [
  { href: '#top', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#work', label: 'Experience' },
  { href: '#contact', label: 'Connect' },
]
// From the blog, section links go back to the home page
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
          <a href="/dev-blog" target="_self" className={onJournal ? 'active' : ''} aria-current={onJournal ? 'page' : undefined}>Dev blog</a>
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
      <div className="hero-inner">
        <div className="hero-head">
          <img className="avatar" src={profile.avatar} alt={`Portrait of ${profile.name}`} width="112" height="112" />
          <div>
            <h1>{profile.name}</h1>
            <p className="hero-role">Senior Game Programmer, C++ / C#</p>
          </div>
        </div>

        <p className="hero-intro">
          {profile.intro} Have a look at my <a href="#projects">personal projects</a> or
          see <a href="#work">where I've worked</a>.
        </p>

        <p className="stack">
          <span className="stack-label">I work in</span>
          {profile.techStack.map(t => (
            <span key={t.name} className="stack-item">
              {t.icon && <Icon name={t.icon} />}{t.name}
            </span>
          ))}
        </p>

        <p className="hero-links">
          <ExternalLink href={links.github}><Icon name="github" /> GitHub</ExternalLink>
          <ExternalLink href={links.linkedin}><Icon name="linkedin" /> LinkedIn</ExternalLink>
          <ExternalLink href={links.youtube}><Icon name="youtube" /> YouTube</ExternalLink>
          <ExternalLink href={links.itch}><Icon name="itchdotio" /> itch.io</ExternalLink>
        </p>
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
          <p className="feature-status">{f.status}</p>
          <h3>{f.title}</h3>
          <p className="feature-role">{f.role} at {f.studio}</p>
          <p className="feature-summary">{f.summary}</p>
          <ul className="square-bullets">
            {f.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
          <p className="tag-line">{f.tags.join(', ')}</p>
          <ExternalLink href={f.link.url} className="btn btn-blue btn-large">{f.link.label}</ExternalLink>
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
                {job.dates}
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

function ProjectCard({ project }) {
  return (
    <article className="card frame">
      <ExternalLink
        href={project.video || project.live || project.code}
        className="card-media"
        aria-label={`${project.video ? 'Watch demo of' : 'View'} ${project.title}`}
      >
        {project.image
          ? <img src={project.image} alt="" loading="lazy" />
          : <span className="card-placeholder" aria-hidden="true">{initials(project.title)}</span>}
      </ExternalLink>
      <div className="card-body">
        <h3>{project.title}</h3>
        <p className="muted small">{[categoryLabel[project.category], project.meta].filter(Boolean).join(' · ')}</p>
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
  const timer = useRef(null)
  const synced = useSyncedProjects()
  const all = [...projects, ...synced]
  // Extra filter chips appear only when a synced repo brings a new category (e.g. Chrome Extensions)
  const chips = [...filters, ...[...new Set(synced.map(p => p.category))]
    .filter(id => !filters.some(f => f.id === id))
    .map(id => ({ id, label: categoryLabel[id] || id }))]
  const visible = shown === 'all' ? all : all.filter(p => p.category === shown)

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
    }, 120)
  }

  return (
    <section className="section" id="projects">
      <SectionTitle sub="Things I build outside work. Gameplay systems, editor tools and a few Chrome extensions. Most have a video and the source.">
        Projects
      </SectionTitle>
      <div className="filters" role="group" aria-label="Filter projects">
        {chips.map(f => (
          <button
            key={f.id}
            className="filter-btn"
            aria-pressed={filter === f.id}
            onClick={() => choose(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={`card-grid ${leaving ? 'is-leaving' : ''}`}>
        {visible.map(p => <ProjectCard key={p.title} project={p} />)}
      </div>
    </section>
  )
}

// Contact links, GitHub activity and the terminal, as one closing section
function Contact() {
  const { links } = profile
  return (
    <section className="section contact" id="contact">
      <SectionTitle>Connect</SectionTitle>
      <p className="contact-text">
        Happy to talk about roles, collaborations or anything game dev. Email is the quickest way to reach me.
      </p>
      <div className="link-row">
        {links.email && <a href={`mailto:${links.email}`} className="btn btn-blue"><Icon name="gmail" /> Email me</a>}
        <ExternalLink href={links.linkedin} className="btn"><Icon name="linkedin" /> LinkedIn</ExternalLink>
        <ExternalLink href={links.github} className="btn"><Icon name="github" /> GitHub</ExternalLink>
        <ExternalLink href={links.resume} className="btn">Resume</ExternalLink>
      </div>

      <div className="contact-block" id="github">
        <h3 className="contact-label">What I've been committing</h3>
        <GitHubActivity user={links.github.split('/').pop()} profileUrl={links.github} />
      </div>

      <div className="contact-block" id="terminal">
        <h3 className="contact-label">Or poke around in the terminal</h3>
        <Terminal />
        <p className="terminal-tip">
          Try <code>help</code>, <code>whoami</code>, <code>experience</code> or <code>sudo hire rahul</code>
        </p>
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
        <Contact />
      </main>
      <footer className="footer">
        <p>Rahul Chandra. Built with React and Vite, source on <ExternalLink href="https://github.com/RahulChandra99/portfolio">GitHub</ExternalLink>.</p>
      </footer>
    </>
  )
}
