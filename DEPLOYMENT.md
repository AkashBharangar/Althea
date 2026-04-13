# Althea deployment guide

Monorepo layout:

- **Frontend** (`frontend/`) → **Vercel**
- **Backend** (`backend/`) → **Render**

The browser calls the Render API directly from the Vite app using `VITE_API_URL`. CORS on the API must allow your Vercel origin(s).

---

## 1. Deploy the backend (Render)

### Option A — GitHub + Blueprint

1. Push this repo to GitHub.
2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repo; Render reads `render.yaml` at the root.
4. Set **environment variables** when prompted (or after deploy):
   - **`CLIENT_ORIGIN`** — your Vercel production URL, e.g. `https://althea.vercel.app`  
     For multiple origins, use commas: `https://althea.vercel.app,https://www.example.com`
   - **`ALLOW_VERCEL_PREVIEWS`** (optional) — set to `1` if you want **all** `https://*.vercel.app` preview URLs to work without listing each one. Omit or set to `0` for a strict allowlist only.
5. Deploy and wait until the service is **Live**.
6. Copy the service URL, e.g. `https://althea-api.onrender.com` (no trailing slash).

### Option B — Manual Web Service

1. **New** → **Web Service** → connect the repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. **Instance type:** Free (or paid).
6. Add the same env vars as above (`CLIENT_ORIGIN`, optional `ALLOW_VERCEL_PREVIEWS`).
7. Optional: **Health check path:** `/api/health`

### After the API is live

- Open `https://YOUR-RENDER-URL/api/health` — you should see `{ "ok": true, "service": "althea" }`.
- Cold starts on the free tier can take ~30–60s on first request.

---

## 2. Deploy the frontend (Vercel)

1. In [Vercel](https://vercel.com) → **Add New** → **Project** → import the same GitHub repo.
2. **Root Directory:** set to `frontend` (important for a monorepo).
3. **Framework preset:** Vite (auto-detected).
4. **Environment variables** (Production — and Preview if you use previews):
   - **`VITE_API_URL`** = `https://YOUR-RENDER-URL` (no trailing slash), e.g. `https://althea-api.onrender.com`
5. Deploy.

`frontend/vercel.json` already sets SPA rewrites so client-side routes fall back to `index.html`.

---

## 3. Wire CORS (checklist)

| Where | What to set |
|--------|-------------|
| **Render** `CLIENT_ORIGIN` | Exact Vercel production URL(s), e.g. `https://althea.vercel.app` |
| **Render** `ALLOW_VERCEL_PREVIEWS` | `1` if you need arbitrary `*.vercel.app` previews; otherwise omit |
| **Vercel** `VITE_API_URL` | Your Render API base URL (no `/api` suffix) |

Rules implemented in `backend/src/server.js`:

- Requests **without** an `Origin` header (e.g. curl, health checks) are allowed.
- Requests whose `Origin` is in `CLIENT_ORIGIN` (comma-separated list) are allowed.
- If `ALLOW_VERCEL_PREVIEWS=1`, `https://*.vercel.app` is allowed.

After changing `CLIENT_ORIGIN` on Render, **redeploy** or restart the service so env vars reload.

---

## 4. Local development (unchanged)

- Backend: `cd backend && npm run dev` (default `http://localhost:8787`).
- Frontend: `cd frontend && npm run dev` — Vite proxies `/api` to `8787` (see `frontend/vite.config.js`).
- Do **not** set `VITE_API_URL` locally unless you want to hit a remote API instead.

---

## 5. Custom domain (optional)

1. Add your domain on **Vercel** for the frontend.
2. Add the same origin to Render **`CLIENT_ORIGIN`**, e.g. `https://app.yourdomain.com`.
3. Keep `VITE_API_URL` pointing at Render (API subdomain can stay on `onrender.com` unless you proxy through your domain).

---

## 6. Troubleshooting

| Issue | What to check |
|--------|----------------|
| Browser: CORS error | `CLIENT_ORIGIN` matches the **exact** page origin (scheme + host, no path). Trailing slashes in env URLs for origins are trimmed when split; still use `https://foo.vercel.app` not `https://foo.vercel.app/`. |
| 404 on refresh | Root Directory must be `frontend` and `vercel.json` rewrites present. |
| API never responds | Render free tier sleep; hit `/api/health` and wait. Confirm `npm start` and `PORT` binding (Render sets `PORT`). |
| Wrong API in production | `VITE_API_URL` is baked in at **build** time — redeploy Vercel after changing it. |

---

## Files touched for deployment

| File | Role |
|------|------|
| `frontend/vercel.json` | Vite build, `dist`, SPA rewrite |
| `frontend/.env.example` | Documents `VITE_API_URL` |
| `backend/.env.example` | Documents `CLIENT_ORIGIN`, `ALLOW_VERCEL_PREVIEWS` |
| `render.yaml` | Render Blueprint + health check |
| `backend/src/server.js` | CORS allowlist + optional Vercel previews |
