# Mobile

Expo Router and NativeWind provide the customer, merchant and courier app. Installed Expo and React Native versions are pinned in package-lock.json.

## Run

    npm ci
    # Copy .env.example to .env and configure Firebase and the API URL.
    npm start

Use npm run android, npm run ios or npm run web for a specific target. An iOS simulator requires macOS. A physical device must be able to reach the backend over your network.

## Code map

- app/(auth): login, registration and password reset.
- app/(customer), app/(merchant), app/(delivery): role-specific screens and layouts.
- src/features: dashboard state, actions and styles.
- src/components/brutal-ui: reusable UI primitives; src/constants/theme.ts: colors and shadows.
- src/lib/api.ts: authenticated requests and typed API methods.
- src/providers: authentication and foreground socket lifecycle.
- src/lib/location-task.ts: native background delivery updates, registered by the root layout.
- src/lib/push-notifications.ts: push registration on supported native devices. Remote push on Android requires a development build.
- src/types: domain models, request contracts and event payloads.

Use @/ imports for files under src. Keep network and business state in feature hooks when a screen grows. The API unwraps successful responses; order and product lists expose items.

Run npm run typecheck before committing. Expo regenerates .expo and expo-env.d.ts when started. Keep native signing files and credentials out of version control.
