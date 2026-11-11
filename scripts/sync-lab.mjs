// Runs before every build. Snapshots the GitHub-synced projects into src/lab.json,
// so they render instantly and still works if GitHub is down.
// If GitHub can't be reached, the last snapshot is kept.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { fetchLab } from '../src/lab.js'

const out = fileURLToPath(new URL('../src/lab.json', import.meta.url))
try {
  const items = await fetchLab(fetch, process.env.GITHUB_TOKEN)
  writeFileSync(out, JSON.stringify({ synced: new Date().toISOString(), items }, null, 2) + '\n')
  console.log(`Synced ${items.length} projects from GitHub`)
} catch (e) {
  console.warn(`Couldn't reach GitHub (${e.message}). Keeping the last snapshot`)
}
