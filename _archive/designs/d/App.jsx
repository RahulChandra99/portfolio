import { useState } from 'react'
import './styles.css'
import { profile, featured, experience, projects, specialisms, skills, education } from '../../data'

const nav = [
  { href: '#top', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#systems', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

// One "slide" per job. Jobs without screenshots get a big typographic panel instead.
const slides = [
  {
    role: experience[0].role,
    company: featured.studio,
    dates: experience[0].dates,
    bullets: [...featured.highlights, ...experience[0].highlights.filter(h => !h.startsWith('Quest'))],
    image: featured.banner,
    imageAlt: `${featured.title} key art`,
    meta: [
      ['Game', featured.title],
      ['Status', 'In development', 'alert'],
      ['Platform', 'PC'],
    ],
    link: { label: 'Wishlist on Steam', url: featured.link.url },
  },
  {
    role: experience[1].role,
    company: experience[1].company,
    dates: experience[1].dates,
    bullets: experience[1].highlights,
    panel: { big: 'AAA', small: 'Unannounced · Console & PC' },
    meta: [['Engine', 'Unreal Engine 5 · GAS'], ['Platform', 'Console + PC']],
  },
  {
    role: experience[2].role,
    company: experience[2].company,
    dates: experience[2].dates,
    bullets: experience[2].highlights,
    panel: { big: '#1', small: 'UK App Store' },
    meta: [['Shipped', 'The Wombats, Mavin Runner'], ['Platform', 'Mobile'], ['Engine', 'Unity · C#']],
  },
  {
    role: experience[3].role,
    company: experience[3].company,
    dates: experience[3].dates,
    bullets: experience[3].highlights,
    panel: { big: 'AR', small: 'Educational apps' },
    meta: [['Engine', 'Unity'], ['Platform', 'Mobile AR']],
  },
]

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
      <button className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="menu" className={`nav ${open ? 'open' : ''}`} aria-label="Main" onClick={() => setOpen(false)}>
        {nav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}
        <ExternalLink href={profile.links.resume}>Resume</ExternalLink>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="slide dark hero" id="top">
      <div className="hero-inner">
        <img className="hero-photo" src={profile.avatar} alt={`Portrait of ${profile.name}`} />
        <div className="hero-box">
          <p className="kicker">Unreal · Unity · C++</p>
          <h1>{profile.name}</h1>
          <p className="hero-role">Senior Game<br />Programmer</p>
          <div className="hero-foot">
            <span className="kicker">Portfolio</span>
            <a href="#work" className="arrow" aria-label="Scroll to work">↓</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkSlide({ slide, index }) {
  const tone = index % 2 === 0 ? 'light' : 'dark'
  const flip = index % 2 === 1
  return (
    <section className={`slide ${tone}`} id={index === 0 ? 'work' : undefined}>
      <div className={`work ${flip ? 'flip' : ''}`}>
        <div className="work-text">
          <h2>{slide.role}</h2>
          <p className="company">{slide.company}</p>
          <p className="dates">{slide.dates}</p>
          <ul className="bullets">
            {slide.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="work-visual">
          {slide.image
            ? <img src={slide.image} alt={slide.imageAlt} loading="lazy" />
            : (
              <div className="panel" aria-hidden="true">
                <span className="panel-big">{slide.panel.big}</span>
                <span className="panel-small">{slide.panel.small}</span>
              </div>
            )}
          <dl className="meta">
            {slide.meta.map(([k, v, tone]) => (
              <div key={k}><dt>{k}:</dt><dd className={tone}>{v}</dd></div>
            ))}
          </dl>
          {slide.link && <ExternalLink href={slide.link.url} className="text-link">{slide.link.label} ↗</ExternalLink>}
        </div>
      </div>
    </section>
  )
}

function Systems() {
  return (
    <section className="slide dark" id="systems">
      <div className="wrap">
        <h2 className="slide-title">Highlights: Systems I have built</h2>
        <div className="collage">
          {projects.map((p, i) => (
            <ExternalLink key={p.title} href={p.video || p.code} className={`shot shot-${i % 7}`}>
              <img src={p.image} alt="" loading="lazy" />
              <span className="shot-label">
                <strong>{p.title}</strong>
                <span>{p.meta}</span>
              </span>
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="slide light" id="about">
      <div className="wrap about">
        <div>
          <h2 className="slide-title">About Me</h2>
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
        <div>
          <h3>What I specialise in</h3>
          <ul className="bullets">{specialisms.map(s => <li key={s}>{s}</li>)}</ul>
          <h3>Education</h3>
          <ul className="bullets">
            {education.map(e => <li key={e.degree}>{e.degree}, {e.school} ({e.year})</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="slide dark" id="skills">
      <div className="wrap">
        <h2 className="slide-title">Skills & Tools</h2>
        <div className="skills">
          {skills.map(s => (
            <div key={s.group}>
              <h3>{s.group}</h3>
              <ul className="bullets">{s.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { links } = profile
  return (
    <section className="slide light contact" id="contact">
      <div className="wrap">
        <p className="kicker">Contact</p>
        <h2 className="contact-title">Let's build something together.</h2>
        {links.email && <a href={`mailto:${links.email}`} className="contact-email">{links.email}</a>}
        <ul className="contact-links">
          <li><ExternalLink href={links.linkedin}><Icon name="linkedin" /> LinkedIn</ExternalLink></li>
          <li><ExternalLink href={links.github}><Icon name="github" /> GitHub</ExternalLink></li>
          <li><ExternalLink href={links.youtube}><Icon name="youtube" /> YouTube</ExternalLink></li>
          <li><ExternalLink href={links.resume}>Resume ↗</ExternalLink></li>
        </ul>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a href="#work" className="skip-link">Skip to content</a>
      <Header />
      <main>
        <Hero />
        {slides.map((s, i) => <WorkSlide key={s.company} slide={s} index={i} />)}
        <Systems />
        <About />
        <Skills />
        <Contact />
      </main>
      <footer className="footer">© {new Date().getFullYear()} {profile.name}</footer>
    </>
  )
}
