# Portfolio

Source for my portfolio site: [rahulchandraprogrammerportfolio.netlify.app](https://rahulchandraprogrammerportfolio.netlify.app)

Built with React and Vite, hosted on Netlify.

## Running it

```bash
npm install
npm run dev
```

## Editing content

- **Profile, featured game, experience and Projects:** `src/data.js`
- **Chrome extensions and other synced projects** fill themselves. Any public repo of mine tagged `portfolio` with a `portfolio.json` at its root shows up in Projects under its category. `npm run build` saves a snapshot to `src/lab.json`, and the page refreshes it from GitHub on load. The format is in `src/lab.js`.

## Journal

The journal at `/journal` mixes my posts with commits from GitHub.

- **Posts** are Markdown files in `journal/`, named `YYYY-MM-DD-some-slug.md`. Push one and it shows up on the live site within about 15 minutes, no redeploy needed.
- **Commits** from my recently pushed public repos fill in on their own, one entry per repo per day.

A post looks like this. Everything in the frontmatter is optional:

```md
---
title: Fixing the wagon desync
date: 2026-11-12 21:40
tags: [unreal, multiplayer]
repos: [some-repo]
building: Red Rust Pioneers
mood: tired but it works
music: whatever's on
draft: true
---

Normal Markdown here. Images, code blocks, links.

9:48 pm: A line that starts with a time becomes a timestamped log line.
```

`draft: true` keeps a post visible in `npm run dev` only. Linked `repos` show as chips under the post.

## Deploying

```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
