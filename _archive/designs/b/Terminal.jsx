import { useEffect, useRef, useState } from 'react'
import { profile, experience, projects, skills, featured } from '../../data'

const prompt = 'rahul@portfolio:~$'

const commands = {
  help: () => [
    'Available commands:',
    '  whoami       who I am',
    '  about        a short intro',
    '  experience   where I have worked',
    '  projects     personal projects (alias: ls)',
    '  skills       languages, engines and tools',
    '  now          what I am working on',
    '  contact      how to reach me',
    '  resume       open my resume',
    '  clear        clear the screen',
  ],
  whoami: () => [`${profile.name}: senior game programmer (Unreal & Unity)`],
  about: () => [profile.intro],
  'cat about.txt': () => [profile.intro],
  experience: () => experience.map(j => `${j.dates.padEnd(20)} ${j.company}: ${j.role}`),
  projects: () => projects.map(p => `${p.title.padEnd(34)} ${p.meta}`),
  ls: () => projects.map(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '/'),
  skills: () => skills.map(s => `${s.group.padEnd(10)} ${s.items.join(', ')}`),
  now: () => [`${featured.title} @ ${featured.studio}: ${featured.summary}`],
  contact: () => [
    profile.links.email && `email     ${profile.links.email}`,
    `linkedin  ${profile.links.linkedin}`,
    `github    ${profile.links.github}`,
  ].filter(Boolean),
  resume: () => {
    window.open(profile.links.resume, '_blank', 'noopener')
    return ['Opening resume in a new tab…']
  },
  'sudo hire rahul': () => {
    if (profile.links.email) window.location.href = `mailto:${profile.links.email}`
    return ['Permission granted. Opening your email client…']
  },
}

const welcome = [
  { type: 'ok', text: `Welcome to ${profile.name}'s portfolio terminal v1.0` },
  { type: 'out', text: "Type 'help' for available commands." },
]

export default function Terminal() {
  const [lines, setLines] = useState(welcome)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  function run(raw) {
    const cmd = raw.trim().replace(/\s+/g, ' ')
    const echo = { type: 'cmd', text: cmd }
    if (!cmd) return setLines(l => [...l, echo])
    setHistory(h => [cmd, ...h])
    setCursor(-1)
    if (cmd === 'clear') return setLines([])
    const handler = commands[cmd.toLowerCase()]
    const output = handler
      ? handler().map(text => ({ type: 'out', text }))
      : [{ type: 'err', text: `command not found: ${cmd}. Type 'help' for available commands.` }]
    setLines(l => [...l, echo, ...output])
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(Math.max(next, -1))
      setInput(next >= 0 ? history[next] : '')
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="terminal-bar">
        <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
        <span className="terminal-title">rahul@portfolio:~</span>
      </div>
      <div className="terminal-body" ref={bodyRef} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`line ${l.type}`}>
            {l.type === 'cmd' && <span className="prompt">{prompt} </span>}
            {l.text}
          </div>
        ))}
        <label className="line input-line">
          <span className="prompt">{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
          />
        </label>
      </div>
    </div>
  )
}
