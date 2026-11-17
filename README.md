# Fashion Profit Lab

Pricing, offer, bundle and advertising contribution analysis for Dare & Rise. Every calculation runs in the browser; Firebase is only used for authentication and explicitly saved data.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and add the Firebase web application configuration values.
3. Enable **Google** as a Firebase Authentication provider.
4. Add your local domain and production GitHub Pages domain to Firebase Authentication → Settings → Authorized domains.
5. Start locally with `npm run dev`.

The app is intentionally unusable for sign-in until Firebase configuration is supplied. Firebase web config values are public client configuration; never add a service account, private key, or administrator secret to this repository.

## Firestore security setup (required before deploy)

1. Sign in once in Firebase Authentication using gmail and copy that user's **UID** from the Firebase Console.
2. Replace `__REPLACE_WITH_APPROVED_FIREBASE_UID__` in `firestore.rules` with the exact UID. Do not use an email as a UID and do not guess it.
3. Deploy the rules using the Firebase CLI or paste them into the Firestore Rules editor and publish.

Until that UID is configured the rules fail closed and deny every Firestore request. Rules require an authenticated account, the approved UID, the exact authorized email, and an email-verified token. Frontend checks are only an additional UI protection.

## GitHub Pages

`vite.config.ts` builds the static site into `docs/`. Production builds default to `/product-costing-app/`, which is the GitHub Pages path for this repository. Set `VITE_BASE_PATH=/repository-name/` for a differently named repository, or `/` for a custom domain/root deployment.

```bash
npm run build
```

Commit the generated `docs/` folder, then configure GitHub Pages to deploy from the `main` branch and `/docs` folder. The interface does not rely on server routing, so it is GitHub Pages safe.

## Finance model notes

- Net sales excludes output GST when prices are GST-inclusive.
- Contribution before advertising excludes CPA; contribution after advertising includes it.
- Break-even CPA equals contribution before advertising, and break-even ROAS is shown only when that CPA is positive.
- Costs can be per item, per order, or percentage-based. Values use `Decimal.js` to avoid floating point currency drift.
- GST, returns/RTO, payment fees and tax credits require business-specific policy review; the tool is an analytical model, not certified tax advice.

## Quality commands

```bash
npm run lint
npm run test
npm run build
```
