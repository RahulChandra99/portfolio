import { useEffect, useState } from 'react'
import './styles.css'
import { profile, featured, experience, projects, specialisms, skills, education } from '../../data'

// Multi-page layout with hash routes: #/ (games), #/about, #/game/<slug>
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const games = [
  {
    slug: slugify(featured.title),
    title: featured.title,
    caption: 'In development · Steam',
    thumb: featured.image,
    thumbPosition: 'left center',
    logo: featured.image,
    intro: `${featured.summary} I'm a ${featured.role} at ${featured.studio}.`,
    details: featured.details,
    hero: featured.banner,
    responsibilities: [...featured.highlights, ...experience[0].highlights.filter(h => !h.startsWith('Quest'))],
    links: [{ label: 'Steam', url: featured.link.url }],
  },
  ...projects.map(p => ({
    slug: slugify(p.title),
    title: p.title,
    caption: `Personal project · ${p.meta}`,
    thumb: p.image,
    intro: p.summary,
    details: p.details || { engine: p.meta },
    video: p.video,
    hero: p.image,
    responsibilities: p.highlights,
    sections: p.sections,
    links: [p.code && { label: 'Source code', url: p.code }, p.video && { label: 'YouTube', url: p.video }].filter(Boolean),
  })),
]

const detailLabels = [
  ['platform', 'Platform'],
  ['engine', 'Engine'],
  ['duration', 'Duration'],
  ['team', 'Team Size'],
  ['role', 'Role'],
]

function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

function youtubeId(url) {
  const m = url && url.match(/(?:v=|youtu\.be\/)([\w-]{11})/)
  return m && m[1]
}

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

function Header({ route }) {
  const isAbout = route === 'about'
  return (
    <header className="header">
      <a href="#/" className="brand">
        <span className="brand-name">{profile.name}</span>
        <span className="brand-role">Senior Game Programmer</span>
      </a>
      <nav className="nav" aria-label="Main">
        <a href="#/" className={!isAbout ? 'active' : ''}>Games</a>
        <a href="#/about" className={isAbout ? 'active' : ''}>About</a>
        <ExternalLink href={profile.links.resume}>Resume</ExternalLink>
      </nav>
    </header>
  )
}

function GamesPage() {
  return (
    <div className="games">
      {games.map(g => (
        <a key={g.slug} href={`#/game/${g.slug}`} className="tile">
          <div className="tile-media">
            <img src={g.thumb} alt="" loading="lazy" style={g.thumbPosition && { objectPosition: g.thumbPosition }} />
          </div>
          <p className="tile-name">{g.title}</p>
          <p className="tile-caption">{g.caption}</p>
        </a>
      ))}
    </div>
  )
}

function GamePage({ game }) {
  const vid = youtubeId(game.video)
  const detailItems = detailLabels.filter(([k]) => game.details?.[k])
  return (
    <article className="case">
      <div className="case-top">
        {game.logo
          ? <img className="case-logo" src={game.logo} alt={game.title} />
          : <h1 className="case-title">{game.title}</h1>}
        <p className="case-intro">{game.intro}</p>
      </div>

      {vid ? (
        <div className="video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${vid}`}
            title={`${game.title} gameplay video`}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : game.hero && <img className="case-hero" src={game.hero} alt={`${game.title} key art`} />}

      <dl className="details">
        {detailItems.map(([k, label]) => (
          <div key={k}><dt>{label}</dt><dd>{game.details[k]}</dd></div>
        ))}
        {game.links.length > 0 && (
          <div>
            <dt>Links</dt>
            <dd>
              {game.links.map((l, i) => (
                <span key={l.url}>{i > 0 && ', '}<ExternalLink href={l.url}>{l.label}</ExternalLink></span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {vid && game.hero && <img className="case-hero" src={game.hero} alt={`${game.title} screenshot`} loading="lazy" />}

      <h2>Responsibilities</h2>
      <ul className="bullets">
        {game.responsibilities.map(r => <li key={r}>{r}</li>)}
      </ul>

      {game.sections?.map(s => (
        <section key={s.heading} className="case-section">
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
          {s.image && <img src={s.image} alt="" loading="lazy" />}
        </section>
      ))}

      <a href="#/" className="back">← Back to games</a>
    </article>
  )
}

function AboutPage() {
  return (
    <div className="about">
      <div className="about-top">
        <img className="about-photo" src={profile.avatar} alt={`Portrait of ${profile.name}`} />
        <div>
          <h1>About me</h1>
          <p>
            I'm a senior game programmer working in C++ with Unreal Engine 5 and C# with Unity. I've built
            multiplayer GAS abilities and AI for an unannounced AAA console and PC project, shipped mobile games
            that reached #1 on the UK App Store, and I'm now building co-op survival systems for Red Rust Pioneers.
          </p>
          <p>
            I like the whole stack of gameplay: mechanics that feel right in the hands, systems designers can tune
            without touching code, and the profiling work that keeps it all inside the frame budget.
          </p>
          <ExternalLink href={profile.links.resume} className="button">View resume</ExternalLink>
        </div>
      </div>

      <h2>Experience</h2>
      <ul className="jobs">
        {experience.map(j => (
          <li key={j.company}>
            <div className="job-head">
              <h3>{j.company}</h3>
              <span>{j.dates}</span>
            </div>
            <p className="job-role">{j.role} · {j.project}</p>
            <ul className="bullets">
              {j.highlights.map(h => <li key={h}>{h}</li>)}
            </ul>
          </li>
        ))}
      </ul>

      <div className="about-cols">
        <div>
          <h2>Skills</h2>
          <dl className="details stacked">
            {skills.map(s => (
              <div key={s.group}><dt>{s.group}</dt><dd>{s.items.join(', ')}</dd></div>
            ))}
          </dl>
        </div>
        <div>
          <h2>Specialisms</h2>
          <ul className="bullets">
            {specialisms.map(s => <li key={s}>{s}</li>)}
          </ul>
          <h2>Education</h2>
          <ul className="bullets">
            {education.map(e => <li key={e.degree}>{e.degree}, {e.school} ({e.year})</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  const { links } = profile
  return (
    <footer className="footer">
      {links.email && <a href={`mailto:${links.email}`} className="footer-email">{links.email}</a>}
      <div className="footer-icons">
        <ExternalLink href={links.linkedin} aria-label="LinkedIn"><Icon name="linkedin" /></ExternalLink>
        <ExternalLink href={links.github} aria-label="GitHub"><Icon name="github" /></ExternalLink>
        <ExternalLink href={links.youtube} aria-label="YouTube"><Icon name="youtube" /></ExternalLink>
      </div>
    </footer>
  )
}

export default function App() {
  const route = useRoute()
  const game = route.startsWith('game/') && games.find(g => g.slug === route.slice(5))

  let page = <GamesPage />
  if (route === 'about') page = <AboutPage />
  else if (game) page = <GamePage game={game} />

  useEffect(() => {
    document.title = game ? `${game.title} | ${profile.name}` : route === 'about' ? `About | ${profile.name}` : `Games | ${profile.name}`
  }, [route, game])

  return (
    <>
      <div className="page">
        <Header route={route} />
        <main>
          {!game && route !== 'about' && <h1 className="visually-hidden">{profile.name}, {profile.role}</h1>}
          {page}
        </main>
      </div>
      <Footer />
    </>
  )
}
