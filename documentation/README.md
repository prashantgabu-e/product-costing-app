# Fashion Profit Lab documentation

This folder documents the current Dare & Rise Fashion Profit Lab application: its user journeys, architecture, services, data, and design system.

| Document | Purpose |
| --- | --- |
| [Setup and services](setup-and-services.md) | Local setup, Firebase, Firestore rules, GitHub Pages, and PWA deployment. |
| [Application architecture](architecture.md) | Routes, features, data flow, calculation model, and Firestore data. |
| [Product import](product-import.md) | The required minimal CSV format and replace-all import behavior. |
| [Design language and UI/UX system](design-language-and-ui-ux.md) | Brand expression, tokens, component family, responsive behavior, accessibility, and interaction patterns. |

## Product purpose

Fashion Profit Lab is a private pricing workspace for Dare & Rise. It helps the approved user model contribution after costs and advertising, create offer references, maintain a catalog, compare saved scenarios, and export local reports.

## Current feature map

- Private Google sign-in and Firebase authorization gate.
- URL-addressable workspace routes for the dashboard, calculators, product library, reports, and settings.
- Profit, bundle, offer, advertising, scenario, and comparison tools.
- Firestore-backed products, offers, scenarios, and settings.
- Replace-all import from the supplied minimal product CSV.
- JSON/CSV exports, print-friendly reporting, dark mode, and an installable PWA shell.

The application is an operational pricing aid, not tax, accounting, or legal advice. GST, returns, payment charges, and contribution assumptions must be checked against current business policy.
