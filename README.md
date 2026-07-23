# Flashcards v2

An AI-powered spaced repetition app. Turn a PDF into a full flashcard deck, then study using a Leitner box system with a gamified level map to track progress.

**Live app:** [flashcards-v2-ten.vercel.app](https://flashcards-v2-ten.vercel.app)

## What it does

- **PDF → Flashcards** — upload a PDF and generate a study deck from it automatically
- **Leitner box system** — cards move between boxes based on how well you know them, so you review weak spots more often
- **Level map** — gamified progress view, saved locally via `localStorage`
- **Built with** React 19 + Vite

## Project structure

```
src/
  App.jsx       # main app shell
  hooks/        # custom React hooks
  data/         # starter/seed flashcard data
  assets/       # static assets
```

> Note: `App.jsx` is currently being refactored from a single monolithic file into smaller, feature-based components. Structure above will keep evolving as that's finished.

## Running locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
