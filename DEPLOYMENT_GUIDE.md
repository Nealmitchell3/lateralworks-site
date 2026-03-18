# lateralworks — Deployment Quick Reference

## First-Time Setup

```bash
cd Downloads\lateralworks-site
npm install
```

## Run Locally (to preview before pushing)

```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Push Changes Live (3-command workflow)

```bash
git add .
git commit -m "Describe what you changed"
git push
```
Vercel auto-deploys in ~60–90 seconds.

## Edit Content

All site text lives in one file:
```
content/site-data.ts
```
Open it in any text editor, find the section, change the text between quotes, save, then run the 3 commands above.

## First-Time GitHub + Vercel Deploy

1. Create repo at https://github.com/new → name it `lateralworks-site`
2. Run:
```bash
git init
git add .
git commit -m "Initial build"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lateralworks-site.git
git push -u origin main
```
3. Go to https://vercel.com → Add New → Project → Import `lateralworks-site`
4. Framework auto-detects as Next.js → Click Deploy

## Common Errors

- **"cannot find path"** → Run `cd Downloads\lateralworks-site` first
- **Build fails** → Check `content/site-data.ts` for missing commas/quotes
- **Site looks old** → Hard refresh: Ctrl+Shift+R
