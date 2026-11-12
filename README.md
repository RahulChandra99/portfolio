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

## Blog

The blog at `/blog` has three kinds of post, plus my GitHub commits filling in as dev updates on their own.

- **Articles** are long-form, with a cover and summary. The newest one gets the big card at the top.
- **Dev updates** are progress notes. Lines that start with a time ("9:40 pm: ...") turn into a log.
- **Thoughts** are short and don't need a title. They read in place on the list.

Each post is a Markdown file in `blog/`, named `YYYY-MM-DD-some-slug.md`. Push one and it's on the live site within about 15 minutes, no redeploy. It joins the RSS feed (`/rss.xml`) on the next build. Images go in `blog/images/`. Everything in the frontmatter is optional, and `draft: true` keeps a post on my machine only.

```md
---
type: article            # article, update (default) or thought
title: Fixing the wagon desync
date: 2026-11-12 21:40
category: Unreal         # shown on the cover
summary: One line for the card
cover: images/wagon.png  # path in blog/ or a full URL
tags: [unreal, multiplayer]
repos: [wagon-game]      # linked under the post
mood: tired              # LiveJournal-style "Current mood"
music: Boards of Canada  # "Current music"
building: the wagon replication
draft: true
---
```

## Deploying

```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
