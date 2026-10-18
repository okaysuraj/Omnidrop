# Omnidrop

Omnidrop has three independently installed apps. The web and mobile apps share a NestJS API, PostgreSQL database and Firebase project.

| Folder | Purpose | Local command |
| --- | --- | --- |
| [backend](backend/README.md) | REST API, database and Socket.IO | npm run dev |
| [web](web/README.md) | Next.js customer, merchant, courier and admin UI | npm run dev |
| [mobile](mobile/README.md) | Expo customer, merchant and courier app | npm start |

## Local setup

Use Node.js 22.13+ or 24.3+, npm, PostgreSQL, and a Firebase project with email/password authentication enabled. The exact dependency versions are pinned in each package-lock.json.

In each app folder, run npm ci and copy .env.example to .env. Fill in the database and Firebase settings before starting the apps. Start the backend first, then web or mobile in separate terminals.

The API runs at http://localhost:4000/api and the web app at http://localhost:3000. For a physical phone, set EXPO_PUBLIC_API_URL to your computer's LAN address. Android emulators use http://10.0.2.2:4000/api.

Stripe keys enable online payments. Web maps and push notifications have optional settings in web/.env.example. Native maps use the Android Google Maps key in mobile/app.json. UPI currently returns a development stub, not a real payment.

## Where changes belong

- Backend business rules live in src/modules/<feature>. Controllers handle HTTP inputs; services handle database work. Entities live in src/database/entities.
- Web routes live in src/app. Shared UI lives in src/components; landing page sections own their own interaction state in src/components/landing.
- Mobile routes live in app, grouped by role. Dashboard hooks and styles live in src/features. Shared UI primitives live in src/components/brutal-ui.
- Each client keeps API calls in src/lib/api.ts and request/response contracts in src/types. Screens receive unwrapped data; paginated endpoints return items and pagination metadata.

Keep small helpers beside their feature. Share code when it is actually reused. Comments should explain a business rule, platform constraint or non-obvious decision. Avoid restating the code.

## Verify changes

Run these commands in the corresponding folder:

    cd backend
    npm run build

    cd ../web
    npm run build

    cd ../mobile
    npm run typecheck

Format source files from the repository root:

    node backend/node_modules/prettier/bin/prettier.cjs --write "backend/src/**/*.{ts,js}" "web/src/**/*.{ts,tsx,css}" "mobile/{app,src}/**/*.{ts,tsx,css}"

Keep package-lock.json files and environment templates. Do not commit secrets, logs, dependencies or generated build output. Netlify deployment settings are in netlify.toml.
