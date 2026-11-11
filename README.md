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

## Deploying

```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
