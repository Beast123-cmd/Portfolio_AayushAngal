# Aayush Angal — Graphite Portfolio

The public website is an immersive React, TypeScript, Vite, Three.js and React Three Fiber graphite world. The original portfolio content remains the canonical source for projects, experience, education, skills, contact, and résumé data. The legacy landing-page components have been removed from the active source tree.

## Routes

- `/` — Graphite experience
- `/experience` — Graphite experience deep link
- `/terminal` — accessible portfolio terminal backed by the same project and experience data

The Graphite scene keeps a readable HTML fallback for browsers where WebGL cannot initialize. Contact submissions reuse the existing backend API; the backend contract is documented in `backend/README.md`.

## Structure

```text
src/
├── graphite/                 # R3F scene, camera, fallback, world styles and lab exhibits
├── components/               # Contact form, terminal and shared UI primitives
├── data/                     # Canonical project, experience and skills records
├── hooks/                    # Toast support
├── pages/                    # Route components
├── App.tsx
└── main.tsx
backend/                      # Existing contact and résumé API
public/                       # Résumé, certificates, favicon and social preview
references/                   # Visual references, not runtime assets
licenses/                     # Third-party license text
docs/                         # Plans, phase reports, setup and license notices
```

The `src/graphite` scene owns its Canvas, WebGL diagnostics and `CameraDirector`. Detailed content and links remain in the DOM. Project plans and reports are grouped under [`docs/`](docs/); third-party attribution is in [`docs/THIRD_PARTY_NOTICES.md`](docs/THIRD_PARTY_NOTICES.md).

## Development

Requires Node.js and npm. Dependencies are already declared in `package.json` and `package-lock.json`.

```bash
npm run dev
npm run build
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm run preview
```

Vite serves port `8080` by default. The production build is written to `dist/`. The Vercel rewrite keeps direct route refreshes on the SPA entry.

## Content and contact

- Projects: `src/data/projects.ts`
- Experience and education: `src/data/experience.ts`
- Skills: `src/data/skills.ts`
- Résumé and certificates: `public/`
- Contact form: `src/components/ContactForm.tsx`
- Contact service: `backend/`

Do not add invented outcomes, project links, résumé details or personal artwork. Keep project facts in the typed data files and preserve the backend API contract.
