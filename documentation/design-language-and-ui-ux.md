# Design language and UI/UX system

## Product character

Fashion Profit Lab is a focused private business tool, not a consumer storefront. The interface should feel calm, exact, and premium: a workspace for making pricing decisions rather than a dashboard full of decorative noise.

The brand expression combines Dare & Rise confidence with financial clarity:

- **Confident:** a saturated indigo action color and decisive, concise labels.
- **Analytical:** tabular numerals, visible cost breakdowns, and outcome-first result panels.
- **Composed:** generous whitespace, restrained borders, and low-contrast neutral surfaces.
- **Private:** account context stays visible in the sidebar, while destructive operations are explicit.

## Design tokens

| Token role | Light | Dark | Use |
| --- | --- | --- | --- |
| Surface | white | slate 900 | Cards, panels, header, sidebar, modal |
| Raised background | slate 50 | near-black blue | Page canvas and chips |
| Primary | indigo 500 | indigo 400/500 | Primary actions, active navigation, focus expression |
| Text | slate 900 | slate 50 | Headings and key values |
| Muted text | slate 500 | slate 400 | Labels, helper text, metadata |
| Border | slate 200 | slate 800 | Card, table, and input separation |
| Positive | emerald | emerald light | Profitable contribution and positive values |
| Negative | red | rose light | Loss, failure, destructive actions |

Tokens are CSS custom properties in `styles.css`; `dark-mode.css` is imported last so dark values reliably override the base palette. Do not use a light-only literal color for a new component unless a matching dark override is added.

## Typography and numbers

- **Typeface:** Inter, with system fallbacks.
- **Headings:** compact and weighty; title hierarchy is page title → panel heading → section label.
- **Eyebrows:** uppercase indigo micro-labels identify context before the heading.
- **Numerals:** financial outputs use tabular numerals and INR formatting to keep columns and result values readable.
- **Copy:** labels state the business meaning first: “Contribution after ads”, not merely “Result”.

## UI component family

| Family | Usage | Behavior |
| --- | --- | --- |
| App shell | Sidebar and top header | Persistent on desktop; sidebar becomes a mobile drawer below 900px. |
| Navigation links | Feature switching | Every menu item is a real URL link and reflects active state. |
| Panels | Primary content grouping | White/dark-surface card with 12px corner radius, border, and 23px desktop padding. |
| Results card | Financial output | High-priority sticky desktop summary; positive/negative color provides fast interpretation. |
| Metric card | Dashboard summary | Compact count/value with muted label and prominent numeric value. |
| Form field | Numeric and text input | Label above control; number fields prevent negative values. |
| Buttons | User action | Indigo primary, neutral secondary, text action, compact chip, and icon-only variants. |
| Notice | Feedback and risk | Informational indigo, warning amber, and danger rose semantic states. |
| Table | Comparable records | Horizontally scrollable on narrow devices; values retain visual alignment. |
| Modal | Focused catalog editing | Full-screen dimmed backdrop with contained form and explicit save/cancel actions. |

## Layout, spacing, and responsiveness

- Desktop shell: 258px sidebar and flexible content area.
- Main content: max width 1350px, with 38px horizontal page padding on desktop.
- Cards use a 12px radius; small controls use 7–9px; chips are pill-shaped.
- Two-column calculator layouts use a fixed 350px result area on desktop and collapse to one column below 900px.
- At 560px, forms, metrics, and quick links become a single column; header padding and panel padding reduce.

## Interaction rules

- Preserve live calculation feedback as fields change; do not require a submit action to view financial impact.
- Make persistence explicit: Save, Delete, Import, and Export should always describe the action.
- Confirm destructive single-record deletes. Replacement product imports state that they remove existing Firestore products.
- Keep the install prompt optional and browser-led; only show the Install app control after the browser provides an installation event.
- Maintain the same semantic feedback colors and contrast in both themes.

## Accessibility baseline

- Use semantic buttons for actions and anchors for navigation.
- Icon-only controls require accessible names.
- Keep text and borders token-based so light and dark mode remain legible.
- Preserve visible focus indicators from native controls and the indigo input outline.
- Do not communicate profit/loss solely with color; labels and signed monetary values remain visible.

## Guidance for new screens

1. Start with the existing page, panel, form-grid, results, notice, and button families before adding new visual primitives.
2. Add a URL route and sidebar link where the feature is a top-level workspace tool.
3. Use design tokens instead of fixed surface, text, or border colors.
4. Validate desktop, drawer/mobile, narrow-phone, and dark-theme states.
5. Put destructive operations behind clear explanatory feedback and use existing confirmation behavior where appropriate.
