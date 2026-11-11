import Terminal from './Terminal'
import './styles.css'
import { profile, featured, experience, projects } from '../../data'

const nav = [
  { href: '#work', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#terminal', label: 'Terminal' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

// Stroke icons in the style of the reference (24x24, currentColor)
const glyphs = {
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  gamepad: <><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" /><path d="M17.3 5H6.7a4 4 0 0 0-4 3.6C2.6 9.4 2 14.5 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.4-1.4a2 2 0 0 1 1.4-.6h4.4a2 2 0 0 1 1.4.6L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.5-.6-6.6-.7-7.3A4 4 0 0 0 17.3 5z" /></>,
  trophy: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />,
  layers: <path d="M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
}
const statIcons = ['clock', 'gamepad', 'trophy', 'layers']

function Glyph({ name }) {
  return (
    <svg className="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyphs[name]}
    </svg>
  )
}

function Icon({ name }) {
  return <span className="icon" style={{ '--icon': `url(/icons/${name}.svg)` }} aria-hidden="true" />
}

function ExternalLink({ href, className, children, ...rest }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

function engineFor(project) {
  if (project.category === 'unreal') return { label: 'Unreal Engine 5', icon: 'unrealengine' }
  if (project.category === 'unity') return { label: 'Unity', icon: 'unity' }
  if (project.tags.includes('Python')) return { label: 'Python', icon: 'python' }
  return { label: 'C++', icon: 'cplusplus' }
}

// The professional title first, then personal projects, all in one grid
const cards = [
  {
    title: featured.title,
    image: featured.image,
    imagePosition: 'left center',
    href: featured.link.url,
    engine: { label: 'Unreal Engine 5', icon: 'unrealengine' },
    status: 'In development',
    summary: featured.summary,
    tags: featured.tags,
  },
  ...projects.map(p => ({
    title: p.title,
    image: p.image,
    href: p.video || p.code,
    engine: engineFor(p),
    status: p.video ? 'Demo video' : null,
    summary: p.summary,
    tags: p.tags,
  })),
]

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <strong>{profile.name}</strong>
          <span>Sr. Game Programmer · Unreal & Unity</span>
        </a>
        <nav className="nav" aria-label="Sections">
          {nav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}
          <ExternalLink href={profile.links.resume} className="nav-resume"><Glyph name="file" /> Resume</ExternalLink>
        </nav>
      </div>
    </header>
  )
}

function SectionHead({ title, children }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

function Card({ card }) {
  const shown = card.tags.slice(0, 3)
  const more = card.tags.length - shown.length
  return (
    <ExternalLink href={card.href} className="card">
      <div className="card-media">
        <img src={card.image} alt="" loading="lazy" style={card.imagePosition && { objectPosition: card.imagePosition }} />
        <span className="chip"><Icon name={card.engine.icon} /> {card.engine.label}</span>
        {card.status && <span className="status">{card.status}</span>}
      </div>
      <div className="card-body">
        <h3>{card.title}</h3>
        <p>{card.summary}</p>
        <ul className="tags">
          {shown.map(t => <li key={t}>{t}</li>)}
          {more > 0 && <li className="more">+{more} more</li>}
        </ul>
      </div>
    </ExternalLink>
  )
}

function Work() {
  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead title="Featured Work">
          The game I'm building now at <ExternalLink href={featured.link.url}>{featured.studio} ↗</ExternalLink>,
          plus gameplay systems and tools I've built on my own, each with a demo video or source.
        </SectionHead>
        <div className="grid">
          {cards.map(c => <Card key={c.title} card={c} />)}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container narrow">
        <SectionHead title="Experience">Five-plus years of gameplay programming across AAA, indie and mobile.</SectionHead>
        <ol className="jobs">
          {experience.map(job => (
            <li key={job.company} className="job">
              <p className="job-when">{job.dates}<br />{job.place}</p>
              <div>
                <h3>{job.company} <span>· {job.role}</span></h3>
                <p className="job-project">{job.project}</p>
                <ul className="bullets">
                  {job.highlights.map(h => <li key={h}>{h}</li>)}
                </ul>
                <ul className="tags">
                  {job.tags.map(t => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function TerminalSection() {
  return (
    <section className="section" id="terminal">
      <div className="container narrow">
        <SectionHead title="Interactive Terminal">
          Explore my portfolio the developer way. Type <code>help</code> to get started.
        </SectionHead>
        <Terminal />
        <p className="tip">Tip: try <code>whoami</code>, <code>experience</code> or <code>sudo hire rahul</code></p>
      </div>
    </section>
  )
}

function About() {
  const { links } = profile
  return (
    <section className="section" id="about">
      <div className="container narrow">
        <SectionHead title="About Me" />
        <div className="about">
          <img className="about-photo" src={profile.avatar} alt={`Portrait of ${profile.name}`} width="240" height="240" />
          <div className="about-text">
            <p>
              I'm a senior game programmer working in C++ with Unreal Engine 5 and C# with Unity. I've built
              multiplayer GAS abilities and AI for an unannounced AAA console and PC project, shipped mobile games
              that reached #1 on the UK App Store, and I'm now building co-op survival systems for Red Rust Pioneers.
            </p>
            <p>
              I like the whole stack of gameplay: mechanics that feel right in the hands, systems designers can tune
              without touching code, and the profiling work that keeps it all inside the frame budget.
            </p>
          </div>
        </div>
        <ul className="stats">
          {profile.stats.map((s, i) => (
            <li key={s.label}>
              <Glyph name={statIcons[i]} />
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </li>
          ))}
        </ul>
        <div className="actions">
          <ExternalLink href={links.resume} className="btn btn-solid"><Glyph name="file" /> Download Resume</ExternalLink>
          <a href="#contact" className="btn btn-outline">Get in Touch</a>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { links } = profile
  return (
    <section className="section contact" id="contact">
      <div className="container narrow">
        <SectionHead title="Let's Connect">
          Open to conversations about gameplay programming roles and collaborations.
          Let's talk about what I can bring to your team.
        </SectionHead>
        <ul className="socials">
          {links.email && <li><a href={`mailto:${links.email}`} aria-label="Email"><Glyph name="mail" /></a></li>}
          <li><ExternalLink href={links.linkedin} aria-label="LinkedIn"><Icon name="linkedin" /></ExternalLink></li>
          <li><ExternalLink href={links.github} aria-label="GitHub"><Icon name="github" /></ExternalLink></li>
          <li><ExternalLink href={links.youtube} aria-label="YouTube"><Icon name="youtube" /></ExternalLink></li>
        </ul>
        {links.email && <a href={`mailto:${links.email}`} className="email">{links.email}</a>}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a href="#work" className="skip-link">Skip to content</a>
      <Header />
      <main id="top">
        <h1 className="visually-hidden">{profile.name}, {profile.role}</h1>
        <Work />
        <Experience />
        <TerminalSection />
        <About />
        <Contact />
      </main>
      <footer className="footer">© {new Date().getFullYear()} {profile.name}. All rights reserved.</footer>
    </>
  )
}
