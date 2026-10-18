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

Use the existing hard borders, offset shadows and shared UI components when changing screens. Add API methods to the client instead of calling fetch from pages.

Run npm run build before committing. npm start serves the production build; npm run lint checks source. The root netlify.toml configures hosting.
