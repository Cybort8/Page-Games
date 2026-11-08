# AGENTS.md

React 18 + Vite 6 SPA: structural reconstruction of `videojuegos-rose.vercel.app` (a Colombian digital game store). Original bundle was minified without source maps, so this is a rebuild, not the original source. UI copy is Spanish; keep it Spanish.

## Commands

```bash
npm install
cp .env.example .env
npm run dev        # Vite dev server
npm run build      # only verification available
npm run preview    # serves dist/
```

There is no test runner, linter, formatter, or typecheck configured. Don't run `npm test` or add tooling unless asked. `npm run build` is the check to run after changes.

## Environment

- Vite only exposes `VITE_*` vars, inlined at build time. Restart `npm run dev` (or rebuild) after editing `.env`.
- `.env` already exists locally and is gitignored; `.env.example` documents the keys.
- API base defaults to `https://backend-videojuegos.onrender.com`. **That backend is dead**: every path returns `404` with header `x-render-routing: no-server`. Empty catalog, login failures, and dashboard errors are expected until `VITE_API_URL` points at a live backend. Check with `curl` before debugging the frontend.

## Architecture

- Entry: `src/main.jsx` → `src/App.jsx` (all routes). Pages in `src/pages/`, shared UI in `src/components/`, cart state in `src/context/CartContext.jsx`.
- All API calls go through `src/api/client.js`, which attaches `Authorization: Bearer <localStorage.token>`. Add endpoints there, not as inline `fetch`. Exception: `Contact.jsx` posts to EmailJS directly (no SDK).
- Auth is client-side only: `ProtectedRoute` checks that `localStorage.token` exists, nothing more. The backend must validate it.
- No search or filter endpoints. Home, Games, and Search each fetch the full `GET /api/products` and filter in the browser (`isFeatured`, category, name). Don't assume server-side search exists.
- Dashboard product writes use two different multipart shapes — preserve them:
  - create: individual fields plus `features[0]`, `features[1]`… plus optional `image`
  - update with new image: one `data` field containing JSON plus `image`
  - update without image: plain JSON via `updateProductJson`
- Cart persists to `localStorage.shopping_cart` as `{ products: [...] }` with client-side `quantity`. Key and shape match the original site; don't rename casually.
- `product.image` is a URL string rendered directly in `<img>`; uploads are `File` objects sent as FormData.

## Styling

- Tailwind 3 with custom tokens in `tailwind.config.js`: colors `paper`, `bone`, `ink`, `cobalt`, `magenta`, `sun`; fonts `display` (Anton) and `sans` (Archivo); shadows `sticker`, `lift`.
- Reusable classes in `src/index.css`: `container-page`, `sign`, `sticker`, `btn` + `btn-primary`/`btn-sun`/`btn-ghost`, `field`, `cartridge`, `spine`.
- Use token classes and these components instead of raw hex or default Tailwind colors. Opacity modifiers must be on Tailwind's scale (`text-ink/70`, not `/65`) — invalid ones are silently dropped from the build.
- The visual identity is deliberate ("barrio game shop as arcade poster"): hard 2px ink borders, offset sticker shadows, no rounded corners, no soft shadows or gradients. Don't flatten it into a generic SaaS layout.

## Deployment / repo

- SPA uses `BrowserRouter`; a static host needs an `index.html` rewrite for deep links. No `vercel.json` or `netlify.toml` exists yet.
- Not a git repository and no CI. `git` commands fail here; don't assume history or branches.
- `dist/` and `node_modules/` are present but gitignored build artifacts.
