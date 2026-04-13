# Althea

**Full-stack web app for emotional language patterns in journal-style text—sentence-level sentiment, trigger-style themes, and observational reflections. Built with open-source NLP (no paid LLM APIs).**

---

## Overview

People often write to understand a day, not to be “fixed.” Althea is built for that habit: you paste or type text, and the app summarizes how sentiment moves through sentences, which topics tend to sit next to lower scores, and a few neutral mirror-style lines that describe what showed up in the language itself.

It is **not** a clinical or therapeutic product. It does not interpret your mental state, predict outcomes, or tell you what to do. It stays inside the text: counts, patterns, and careful wording that avoids advice and diagnosis.

---

## Key Features

- **Sentence-level sentiment** — A simple polarity timeline across the piece you submitted, so you can see where the language brightens or dims.
- **Trigger-style ranks** — Nouns and phrases surfaced from the text, scored in relation to sentiment (topics that more often appear near lower-scoring sentences). Useful as a starting point for your own reflection, not as a label of “what is wrong.”
- **Observational reflections** — Short, template-grounded lines that describe patterns in the writing (e.g., balance of positive and negative sentences, volatility). They are descriptive, not prescriptive.
- **Calm UI** — A restrained interface meant to feel like a quiet studio, not a dashboard for a crisis service.

---

## Design Principles

- **Non-clinical** — No symptom language, no “you should,” no implied expertise about your life.
- **Transparency** — The pipeline is rule- and library-based; there is no hidden model vendor or black-box scoring you cannot reason about at a high level.
- **Low pressure** — Copy and layout favor clarity and breathing room over urgency, streaks, or gamification.
- **Honest scope** — The app shows what the algorithms can see in text, and stops there.

---

## Tech Stack

| Layer | Choices |
|--------|---------|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express |
| **NLP** | [`sentiment`](https://www.npmjs.com/package/sentiment) (polarity), [`compromise`](https://www.npmjs.com/package/compromise) (lightweight NLP / keyword-style extraction) |
| **APIs** | None required for analysis; no OpenAI or other paid inference endpoints in the core path |

---

## Project Structure

```
althea/
├── frontend/              # Vite + React SPA (Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   └── lib/
│   ├── public/
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/               # Express API (Render)
│   └── src/
│       ├── routes/
│       ├── services/
│       └── utils/
├── package.json           # Root scripts (concurrent dev, full build)
├── render.yaml            # Render blueprint
├── DEPLOYMENT.md          # Vercel + Render checklist
├── LICENSE
└── README.md
```

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

1. **Clone the repository** and open the project root.

2. **Install dependencies**

   ```bash
   npm install
   npm run install:all
   ```

   `install:all` installs dependencies for both `frontend` and `backend`.

3. **Environment files**

   - Copy `backend/.env.example` to `backend/.env` and adjust if needed. For local dev, `CLIENT_ORIGIN=http://localhost:5173` is typical.
   - Optionally copy `frontend/.env.example` to `frontend/.env`. For local development you can leave `VITE_API_URL` unset; Vite proxies `/api` to the backend (see `frontend/vite.config.js`).

4. **Run both apps**

   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: default port **8787** (or `PORT` from `backend/.env`)

5. **Build (production-style)**

   ```bash
   npm run build
   ```

6. **API quick check**

   - Health: `GET /api/health`
   - Analyze: `POST /api/analyze` with JSON body `{ "text": "Your journal or chat excerpt here." }` (max length enforced in `backend/src/routes/analyze.js`).

---

## System Flow

1. The browser sends the user’s text to the API.
2. The backend splits the text into sentences and scores each with the sentiment lexicon.
3. **Compromise** helps extract noun-like cues; those are ranked against sentence scores to highlight recurring themes that skew with lower sentiment.
4. A small reflection layer turns aggregate metrics into fixed, observational templates (no free-form generative “advice”).
5. The frontend renders a timeline, tags, and cards from that structured JSON.

---

## Deployment

- **Frontend (Vercel):** Set the project root to `frontend`. Build: `npm run build`, output: `dist`. Set `VITE_API_URL` to your public API URL (no trailing slash).
- **Backend (Render):** Root directory `backend`; `npm install` and `npm start`. Set `CLIENT_ORIGIN` to your Vercel origin(s). Optional: `ALLOW_VERCEL_PREVIEWS=1` for `*.vercel.app` previews. Health check path: `/api/health`.

Step-by-step notes live in **`DEPLOYMENT.md`**.

---

## Limitations

- **English-centric** — The `compromise` pipeline and sentiment lexicon are oriented toward English; other languages will not behave reliably.
- **Lexicon sentiment is shallow** — Sarcasm, mixed emotions, and domain-specific nuance are easy to misread.
- **Triggers are statistical, not causal** — A word appearing near lower scores is correlation in *this* text, not proof of a life pattern.
- **No accounts or persistence** in the current shape — text is processed for the request; long-term storage is a product decision you would add explicitly.
- **Not for emergencies** — If someone is at risk, they need real people and professional help, not an app.

---

## Roadmap

- Optional auth and encrypted storage for people who want history on their own terms.
- Stronger linguistic handling (negation, contrast, longer documents) within the same “no advice” boundary.
- Export (e.g., Markdown/PDF) for personal archives.
- Accessibility pass (motion-reduced paths, screen reader tuning).
- Automated tests around the analyze pipeline and API contracts.

---

## Ethical Positioning

Althea is a **language mirror**, not a caregiver.

- It **must not** present itself as therapy, counseling, or medical care.
- It **must not** output diagnosis, treatment suggestions, or instructions about medication, relationships, or safety decisions.
- It **should** use neutral, observational language and invite the human to decide what, if anything, the output means for them.
- Anyone shipping a fork for real users should add clear disclaimers, age-appropriate flows where relevant, and a path to human crisis resources where the law or context requires it.

If you extend the product, keep the boundary between **describing text** and **directing a life** explicit in both UX and copy.

---

## Why This Project Matters

Althea is a full-stack exercise in building something people might actually open when they are tired: fast feedback loops, honest limits, and deployment to real hosts. It shows comfort with React and modern tooling, a small but coherent API design, and integration of open-source NLP without outsourcing judgment to a proprietary chat model. For teams that care about **responsible product framing**, the README and the code are meant to read as intentional, not accidental.

---

## Contributing

Issues and pull requests are welcome. Please keep changes aligned with the non-clinical, non-advisory positioning. For larger features, open an issue first so scope and ethics constraints stay aligned.

---

## License

[MIT](LICENSE)
