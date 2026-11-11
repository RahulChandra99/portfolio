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
- **Lab:** fills itself. Any public repo of mine tagged with the `portfolio` topic that has a `portfolio.json` at its root shows up there. `npm run build` saves a snapshot to `src/lab.json`, and the page refreshes it from GitHub when it loads. See `src/lab.js` for the format.

## Deploying

```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```
