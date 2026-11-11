import { useEffect, useRef, useState } from 'react'

// Public mirror of the GitHub contribution calendar (CORS-enabled, no token needed).
// If it fails to load, the section simply doesn't render.
const API = 'https://github-contributions-api.jogruber.de/v4/'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toWeeks(days) {
  // Pad the start so each column is one Sunday–Saturday week
  const pad = new Date(days[0].date).getUTCDay()
  const cells = [...Array(pad).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function monthLabels(weeks) {
  let last = -1
  return weeks.map(week => {
    const first = week.find(Boolean)
    const month = first ? new Date(first.date).getUTCMonth() : last
    if (month === last) return ''
    last = month
    return MONTHS[month]
  })
}

export default function GitHubActivity({ user, profileUrl }) {
  const [data, setData] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${API}${user}?y=last`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => !cancelled && setData(d))
      .catch(() => {})
    return () => { cancelled = true }
  }, [user])

  // On narrow screens, start scrolled to the most recent weeks
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [data])

  if (!data?.contributions?.length) return null

  const weeks = toWeeks(data.contributions)
  const labels = monthLabels(weeks)
  // Skip a label if the next one is too close to fit
  const shown = labels.map((l, i) => (l && !labels.slice(i + 1, i + 3).some(Boolean) ? l : ''))

  return (
    <div className="gh-activity">
      <p className="gh-total">
        <strong>{data.total.lastYear}</strong> contributions in the last year
      </p>
      <div className="gh-scroll" ref={scrollRef}>
        <div className="gh-graph" style={{ '--weeks': weeks.length }}>
          <div className="gh-months" aria-hidden="true">
            {shown.map((l, i) => <span key={i}>{l}</span>)}
          </div>
          <div className="gh-grid" role="img" aria-label={`${data.total.lastYear} GitHub contributions in the last year`}>
            {weeks.flat().map((d, i) =>
              d
                ? <span key={d.date} className={`gh-day l${d.level}`} title={`${d.count} on ${d.date}`} />
                : <span key={`pad${i}`} className="gh-day empty" />
            )}
          </div>
        </div>
      </div>
      <div className="gh-footer">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">@{user} on GitHub ↗</a>
        <span className="gh-legend" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map(l => <span key={l} className={`gh-day l${l}`} />)}
          More
        </span>
      </div>
    </div>
  )
}
