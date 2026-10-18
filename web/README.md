# Web

Next.js App Router, React and Tailwind power the customer storefront and merchant, courier and admin portals.

## Run

    npm ci
    # Copy .env.example to .env and configure Firebase and the API URL.
    npm run dev

Open http://localhost:3000. The backend must be running for catalog, profile, cart and order data.

## Code map

- src/app: URL routes and page composition.
- src/components/landing: marketing sections with local interaction state. The sample shelf is separate from the live catalog in Explore.
- src/components/shared: navigation, footer and order map.
- src/providers: Firebase session and Socket.IO connection lifecycle.
- src/lib/api.ts: authorization, response unwrapping and endpoint methods.
- src/types: domain models, API inputs and event payloads.

Use the semantic color tokens, layered CSS components and shared UI components described in [DESIGN.md](DESIGN.md) when changing screens. Add API methods to the client instead of calling fetch from pages.

Run npm run build before committing. npm start serves the production build; npm run lint checks source.

## Netlify deployment

Hosting settings live in [netlify.toml](netlify.toml). In Netlify's build settings, set the site's Base directory to `web` so Netlify finds `web/netlify.toml`, installs dependencies and runs `npm run build` inside `web/`. The publish directory `.next` is relative to that base directory. See [Netlify's configuration file discovery rules](https://docs.netlify.com/build/configure-builds/monorepos/#how-netlify-finds-your-configuration-files).
