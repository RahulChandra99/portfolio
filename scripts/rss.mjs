// Runs after every build. Writes dist/rss.xml from blog/*.md so people can follow new posts.
// A post pushed without a redeploy shows on the site straight away but joins the feed on the next build.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parsePost, JOURNAL_DIR } from '../src/journal.js'

const SITE = 'https://rahulchandraprogrammerportfolio.netlify.app'
const root = fileURLToPath(new URL('..', import.meta.url))
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const posts = readdirSync(`${root}/${JOURNAL_DIR}`)
  .filter(f => /^\d{4}-\d{2}-\d{2}.*\.md$/.test(f))
  .map(f => parsePost(f, readFileSync(`${root}/${JOURNAL_DIR}/${f}`, 'utf8')))
  .filter(p => !p.draft)
  .sort((a, b) => b.sortKey - a.sortKey)

const firstPara = body => (body.split(/\n\s*\n/).map(s => s.trim()).find(s => s && !/^(#|!\[|```)/.test(s)) || '')
  .replace(/^\d{1,2}:\d{2}(\s?[ap]m)?\s*[:\-–]\s*/i, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').slice(0, 300)

const items = posts.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/dev-blog/${p.slug}</link>
      <guid>${SITE}/dev-blog/${p.slug}</guid>
      <pubDate>${new Date(p.sortKey || Date.now()).toUTCString()}</pubDate>
      <category>${esc(p.type)}</category>
      <description>${esc(p.summary || firstPara(p.body))}</description>
    </item>`).join('\n')

writeFileSync(`${root}/dist/rss.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Rahul Chandra's dev blog</title>
    <link>${SITE}/dev-blog</link>
    <description>Dev updates and articles on game programming</description>
    <language>en</language>
${items}
  </channel>
</rss>
`)
console.log(`Wrote rss.xml with ${posts.length} posts`)
