# Omnidrop AI Agent Guidelines & Architecture Rules

This file outlines the architecture standards, tech stack versions, and operational conventions for AI agents working in this repository.

---

## 1. Monorepo Architecture Overview

Omnidrop is a multi-role hyperlocal quick-commerce platform consisting of three primary services:

- **`backend/`**: NestJS 11 + TypeORM + PostgreSQL (Neon) REST & WebSocket API.
- **`web/`**: Next.js 15+ (App Router, Turbopack) + Tailwind CSS Neo-Brutalist web application.
- **`mobile/`**: React Native (Expo SDK 52) + Expo Router v4 + NativeWind v4 mobile application.

---

## 2. Subsystem Guidelines

### Backend (`backend/`)
- **Framework**: NestJS 11 with TypeScript.
- **ORM**: TypeORM with PostgreSQL (`pg`). Database entities live in `src/database/entities/`.
- **Response Format**: All successful REST responses are intercepted by `TransformInterceptor` and formatted as:
  ```json
  { "success": true, "data": ... }
  ```
- **Authentication**: Secured via `FirebaseAuthGuard` and `@CurrentUser()` decorator. Role authorization uses `@Roles(...)` and `RolesGuard`.
- **Real-Time**: Socket.io gateway in `src/websockets/ws.gateway.ts`. Join rooms via `joinOrder` or `joinDelivery` events.
- **Payments**: Handled in `src/modules/payments/` with Stripe PaymentIntents and Webhooks.

### Web Frontend (`web/`)
- **Framework**: Next.js 15+ with React 19 and App Router (`src/app/`).
- **Styling**: Neo-Brutalist design language with hard borders (`border-2 border-black`), sharp offset shadows (`shadow-[4px_4px_0px_0px_#000]`), bold typography, and dynamic accent colors.
- **Design Tokens**: Standardized components live in `src/components/shared/` (`BrutalNav`, `BrutalFooter`, `LiveMap`, etc.).
- **State & Auth**: `AuthProvider` listens to Firebase Auth state and attaches authorization tokens to API requests.
- **Maps**: Leaflet with dynamic client-side loading (`LiveMap`).

### Mobile App (`mobile/`)
- **Framework**: Expo SDK 52 with Expo Router v4 (`app/` directory).
- **Navigation Groups**:
  - `(auth)`: Login, registration, password recovery.
  - `(customer)`: Customer browsing, cart, checkout, tracking, wallet.
  - `(delivery)`: Delivery partner dashboard, task acceptance, active delivery.
  - `(merchant)`: Merchant portal, order management, inventory controls.
- **Styling**: NativeWind v4 with Neo-Brutalist design tokens defined in `src/components/brutal-ui.tsx`.
- **Background Tasks**: Location updates use `expo-task-manager` and `expo-location` (`src/lib/location-task.ts`).

---

## 3. General Development Rules

1. **Maintain Type Safety**: Always use existing types in `src/types/` (web/mobile) and entity definitions (backend).
2. **Environment Variables**: Never commit real secret keys. Always update `.env.example` files when adding new variables.
3. **Avoid Boilerplate Clutter**: Do not leave unused starter assets, build artifacts (`*.tsbuildinfo`), or temporary test scripts.
4. **Pre-flight Checks**: Before committing, ensure `npm run build` succeeds in `backend` and `web`, and `npx tsc --noEmit` passes in `mobile`.
