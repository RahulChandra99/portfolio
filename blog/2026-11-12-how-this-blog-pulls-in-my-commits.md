---
type: article
title: How this blog pulls in my GitHub commits
date: 2026-11-12 22:30
category: Web
summary: The blog is a folder of Markdown files in my portfolio repo, and the dev updates fill themselves from GitHub. Here's how that works and what broke while I set it up.
tags: [portfolio, github]
repos: [portfolio]
---

I wanted somewhere to write about what I'm building that I actually own. No Medium paywall, no platform that might vanish. So the blog is a folder of Markdown files in the same repo as the site.

## Writing a post

A post is a file in `blog/` named with the date first. Push it and it's live within about 15 minutes, no redeploy. The page compares each file's git hash with the version baked in at build time and only downloads what changed.

## Commits as dev updates

Between posts, the feed shows what I pushed to GitHub. It asks the GitHub API for my most recently pushed public repos, pulls their commits, and groups them into one entry per repo per day.

### What broke

The first version used the GitHub events API. It came back empty for days at a time. Switching to the per-repo commits API fixed it, but then the unauthenticated rate limit started returning partial data, and the feed would quietly shrink. Now the live data gets merged with a snapshot taken at build time, so a rate-limited repo keeps its old entries instead of disappearing.

## What I'd change

Commits only show for public repos, which is right, but it means a month of work on a private Unreal project looks like silence. I'll write dev updates by hand for those.
