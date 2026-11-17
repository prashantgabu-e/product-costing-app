# Setup and services

## Requirements

- Node.js 20 or newer.
- A Firebase project with Authentication and Cloud Firestore.

## Local configuration

1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Populate the `VITE_FIREBASE_*` values from Firebase Console → Project settings → Your apps → Web app.
4. For local development, keep `VITE_BASE_PATH=/`.

Firebase web configuration values identify the client project; they are not server secrets. Never commit a Firebase service-account JSON file, private key, or administrative credential.

## Firebase Authentication

1. In Firebase Console, enable **Google** under Authentication → Sign-in method.
2. Add the development and production hostnames under Authentication → Settings → Authorized domains.
3. Sign in once using the approved account and copy its Firebase Authentication UID.

The application permits the approved, verified email only. The frontend gate is not the security boundary; Firestore Rules enforce the same identity restrictions.

## Firestore

1. Create Firestore in production mode.
2. Replace `__REPLACE_WITH_APPROVED_FIREBASE_UID__` in `firestore.rules` with the actual UID.
3. Deploy the rules with Firebase CLI or publish them in the Firebase Console Rules editor.

Rules fail closed until the UID is replaced. The app stores data beneath:

```text
users/{approvedUid}/products/{productId}
users/{approvedUid}/offers/{offerId}
users/{approvedUid}/scenarios/{scenarioId}
users/{approvedUid}/settings/preferences
```

## GitHub Pages

The Vite build output directory is `docs/`. Production builds default to this repository’s GitHub Pages path: `/product-costing-app/`. Set `VITE_BASE_PATH=/repository-name/` when deploying under another repository name, or `/` for a root-domain site. Deploy GitHub Pages from the `main` branch and `/docs` folder.

The application has URL routes such as `/product-library`. `public/404.html` restores requested routes when GitHub Pages returns its static 404 page for a direct route visit.

## PWA service

The PWA is dependency-free and consists of:

- `public/manifest.webmanifest` — installed-app metadata.
- `public/service-worker.js` — application-shell caching and offline navigation fallback.
- `public/favicon.svg` and `public/app-icon.svg` — SVG browser and installed-app branding.

PWA installation requires HTTPS in production (or localhost while developing). Supported browsers reveal the in-app **Install app** action once their installability checks pass. A service-worker update becomes active after the browser refreshes the page.
