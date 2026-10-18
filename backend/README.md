# Backend

NestJS 11, TypeORM and PostgreSQL provide the REST API and Socket.IO events used by both clients.

## Run

    npm ci
    # Copy .env.example to .env and fill in your credentials.
    npm run dev

The API listens on port 4000 under /api. Successful responses use { success: true, data }. FirebaseAuthGuard resolves the signed-in user; RolesGuard enforces role permissions.

## Code map

- src/main.ts: application startup, Firebase, CORS and global HTTP behavior.
- src/app.module.ts: module and database registration.
- src/modules: feature controllers and services. OrdersService handles queries, status changes and cancellation; CheckoutService owns transactional checkout.
- src/database/entities: persisted models. data-source.ts configures the migration CLI.
- src/websockets: authenticated real-time rooms and events.
- src/common: guards, decorators, response transformation and exception handling.

Development synchronizes the schema automatically; production disables synchronization. Apply reviewed migrations before deploying schema changes.

## Commands

- npm run build: compile to dist; npm start: run the compiled API.
- npm run lint: check TypeScript source; npm run format: format source.
- npm run seed: insert sample catalog data into the configured database after registering a user. Review src/database/seed.js before using it.
- npm run set-role -- user@example.com SHOPKEEPER: change a registered user's role.
- npm run migration:generate -- src/database/migrations/ChangeName: generate a migration.
- npm run migration:run: apply migrations; npm run migration:revert: revert the last migration.

Stripe handles card payment intents and signed webhooks. RazorpayService is only a UPI development stub. Payment and database failures retain error diagnostics; routine success messages are omitted.
