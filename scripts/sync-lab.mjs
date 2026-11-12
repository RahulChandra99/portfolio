// Runs before every build. Snapshots the GitHub-synced projects into src/lab.json and the
// journal's commit activity into src/activity.json, so both render instantly and still work
// if GitHub is down. If GitHub can't be reached, the last snapshot is kept.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { fetchLab } from '../src/lab.js'
import { fetchActivity } from '../src/journal.js'

const save = (name, data) =>
  writeFileSync(fileURLToPath(new URL(`../src/${name}`, import.meta.url)), JSON.stringify({ synced: new Date().toISOString(), ...data }, null, 2) + '\n')

try {
  const items = await fetchLab(fetch, process.env.GITHUB_TOKEN)
  save('lab.json', { items })
  console.log(`Synced ${items.length} projects from GitHub`)
} catch (e) {
  console.warn(`Couldn't reach GitHub for projects (${e.message}). Keeping the last snapshot`)
}

try {
  const activity = await fetchActivity(fetch, process.env.GITHUB_TOKEN)
  save('activity.json', activity)
  console.log(`Synced ${activity.days.length} days of commits from GitHub`)
} catch (e) {
  console.warn(`Couldn't reach GitHub for journal activity (${e.message}). Keeping the last snapshot`)
}
