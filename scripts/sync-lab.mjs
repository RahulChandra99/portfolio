// Runs before every build: snapshots the Lab projects from GitHub into src/lab.json,
// so the section renders instantly and still works if GitHub is down.
// If GitHub can't be reached, the last snapshot is kept.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { fetchLab } from '../src/lab.js'

const out = fileURLToPath(new URL('../src/lab.json', import.meta.url))
try {
  const items = await fetchLab(fetch, process.env.GITHUB_TOKEN)
  writeFileSync(out, JSON.stringify({ synced: new Date().toISOString(), items }, null, 2) + '\n')
  console.log(`Lab: ${items.length} projects from GitHub`)
} catch (e) {
  console.warn(`Lab: couldn't reach GitHub (${e.message}), keeping the last snapshot`)
}
