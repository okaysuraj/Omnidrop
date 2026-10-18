# Omnidrop web design

The web app is a friendly neighborhood marketplace. Prioritize finding products, understanding order totals, and managing deliveries. Keep routes, authentication and payment contracts intact when changing presentation.

## Visual direction

- Layout variance: 6/10. Use a distinctive split hero, then predictable shopping grids.
- Motion: 3/10. Use short hover and press feedback; reserve spinners for real loading states.
- Density: 4/10. Give content breathing room while keeping shopping controls close together.
- Typography: Manrope, loaded once through `next/font`. Use sentence case, clear headings and tabular numbers for prices.
- Icons: Lucide, with a consistent 1.8 stroke. Use accessible labels on icon buttons. Avoid emoji controls.

## Tokens and components

`src/app/globals.css` defines semantic color tokens. Use `canvas`, `surface`, `muted`, `ink`, `secondary`, `line`, `brand`, `brand-soft`, and `on-brand` utilities. Use `danger` and `warning` only for their associated states. The default light palette is canvas `#f7f9f7`, surface `#ffffff`, ink `#1c3026`, secondary `#53645a`, line `#dfe7e1`, and brand `#28734d`.

System preference selects the initial theme; the header toggle saves an explicit choice. Both themes use the same semantic tokens. Do not add fixed white surfaces or neon accent colors to individual routes.

Keep base rules in `@layer base` and reusable components in `@layer components`. An unlayered universal margin/padding reset overrides Tailwind utilities and breaks layout spacing.

- `site-container`: 1248px maximum width; 24px desktop and 20px mobile gutters.
- `section-space`: 88px desktop and 56px mobile section rhythm.
- `surface-card` / `surface-panel`: 20px corners, subtle border and restrained shadow.
- `button-primary` / `button-secondary`: 12px corners and a minimum 46px height.
- `field-input` / `field-label`: consistent form sizing, contrast, labels and focus feedback.
- `filter-pill`: selected state uses `aria-pressed`.
- Shared `ProductCard`, `StoreCard`, `AuthShell`, `FormAlert` and site navigation keep screens consistent.

Preserve visible focus, reduced motion, mobile layouts and meaningful empty/error states. Product previews on the landing page are explicitly illustrative and never write to the actual cart. Live inventory, prices, ratings and delivery estimates must come from the API.

## Photography

The landing page retains the existing local hero and courier photographs. Grocery thumbnails in `public/images/` are locally stored, optimized Unsplash images. Source photo IDs: bread `photo-1509440159596-0249088772ff`, avocados `photo-1523049673857-eb18f1d7b578`, oranges `photo-1547514701-42782101795e`, eggs `photo-1518569656558-1f25e69d93d7`, milk `photo-1550583724-b2692b85b150`, vegetables `photo-1540420773420-3366772f4999`. See the [Unsplash license](https://unsplash.com/license).
