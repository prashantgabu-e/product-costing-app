# Application architecture

## Technology

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript, CSS |
| Build | Vite |
| Motion and icons | Framer Motion, Lucide React |
| Charts | Recharts |
| Financial arithmetic | Decimal.js |
| Identity and persistence | Firebase Authentication and Cloud Firestore |
| Offline/install shell | Web App Manifest and Service Worker |

## Route map

The app uses browser-history URLs and intercepts internal navigation without a full document reload.

| Route | View |
| --- | --- |
| `/dashboard` | Workspace overview and tool shortcuts |
| `/quick-profit-calculator` | Product-level profit calculation |
| `/offer-builder` | Offer reference builder |
| `/bundle-calculator` | Bundle contribution model |
| `/ads-break-even` | CPA, ROAS, and sensitivity model |
| `/scenario-simulator` | Saveable what-if scenario |
| `/scenario-comparison` | Saved scenario comparison |
| `/product-library` | Product catalog and CSV replacement import |
| `/reports` | JSON, CSV, and print exports |
| `/settings` | Local and Firestore-backed preferences |

## Authentication and authorization

`src/firebase/auth.ts` observes the Firebase session and only permits the configured approved account. `firestore.rules` separately checks authenticated UID, email, and verified-email state before any reads or writes. All business data lives beneath the authenticated user’s own Firestore path.

## Financial model

`src/engine/profit.ts` uses Decimal.js for currency calculations. It accounts for GST-inclusive or GST-exclusive selling prices, per-item costs, per-order costs, percentage costs, quantity, discount, and advertising CPA. The model exposes customer payable, net sales excluding output GST, variable cost, contribution before ads, contribution after ads, margin, and break-even CPA.

## Persistence behavior

- Products, offers, scenarios, and settings are explicitly saved by the user.
- Products can be created, edited, deleted, exported, and replaced from the required CSV.
- The product replacement import deletes existing Firestore products before writing the imported dataset. An import failure after deletion can leave the collection partially populated; keep the exported JSON backup before a large import.
- Reports are generated in the browser and are not automatically uploaded.

## File responsibilities

| Location | Responsibility |
| --- | --- |
| `src/App.tsx` | Application shell, routes, screen components, client interactions, CSV parser |
| `src/engine/profit.ts` | Deterministic calculation engine |
| `src/firebase/auth.ts` | Google sign-in, observer, and sign-out |
| `src/firebase/store.ts` | Firestore CRUD and batched replacement writes |
| `src/styles.css` | Base layout and component styling |
| `src/dark-mode.css` | Final dark-theme token and component overrides |
| `public/service-worker.js` | PWA cache behavior |
