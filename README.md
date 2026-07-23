# ⚡ Omnidrop

**Live Website:** [https://omnidropapp.netlify.app](https://omnidropapp.netlify.app)

## 🎯 Overview

Omnidrop connects:
1. **Customers**: Discover nearby stores, browse products, and get instant delivery.
2. **Shopkeepers**: Manage inventory, fulfill orders, and track store performance.
3. **Delivery Partners**: Accept local delivery tasks, track routes via GPS, and earn per delivery.
4. **Admins**: Monitor platform metrics, manage users, and oversee operations.

## 🧱 Tech Stack

### Frontend (Web)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS (Glassmorphism, Dark Mode)
- **Auth**: Firebase Authentication (Client SDK)

### Backend (API)
- **Runtime**: Node.js
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (via TypeORM)
- **Real-time**: Socket.IO (WebSockets)
- **Auth Verification**: Firebase Admin SDK

### Infrastructure
- **Containers**: Docker + Docker Compose
- **Database**: PostgreSQL 16
- **Cache / Queues**: Redis 7 (planned for BullMQ / caching)

## 🏗️ Architecture

The backend follows a **Modular Monolith** architecture with strict separation of concerns. The API serves as the single source of truth for business logic, RBAC (Role-Based Access Control), and data integrity.

### Key Features
- **Geo-Discovery**: Haversine formula implemented in SQL to find nearby stores.
- **Role-Based Access**: Custom `@Roles` guard to enforce CUSTOMER, SHOPKEEPER, DELIVERY_PARTNER, and ADMIN permissions.
- **Real-Time Tracking**: WebSockets handle live order status updates and delivery partner location tracking.
- **Transactional Checkout**: Ensures atomic operations when decrementing stock and creating orders/payments.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- A Firebase Project (for Authentication)

### 1. Infrastructure (Database & Redis)

Start the local PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables:
1. Copy `.env.example` to `.env`.
2. Provide your `FIREBASE_PROJECT_ID`.
3. Put your Firebase Admin SDK service account key in `firebase-service-account.json`.

Run the backend API:
```bash
npm run start:dev
```
The API will run on `http://localhost:4000/api`.

### 3. Frontend Setup

```bash
cd web
npm install
```

Configure environment variables:
1. Copy `.env.local.example` to `.env.local`.
2. Provide your Firebase client config values.

Run the web app:
```bash
npm run dev
```
The web app will run on `http://localhost:3000`.

## 🎨 UI/UX Design

Omnidrop features a premium, dynamic design out of the box:
- **Glassmorphism**: Translucent cards with subtle blurs and borders.
- **Micro-animations**: Pulse effects for live tracking, hover states, and shimmer loading skeletons.
- **Vibrant Gradients**: Deep dark mode backgrounds contrasted with energetic primary/accent gradients.

## 📖 License

Proprietary. All rights reserved.

---

## 📊 Project Audit Report

### Summary
Overall, the architectural foundation of the Omnidrop hyperlocal marketplace is impressively solid. The backend database schema (PostgreSQL), websockets for real-time tracking, background jobs setup, and basic role-based structure are in place. However, several production-critical features listed in your requirements are either mocked, partially implemented, or entirely missing on the frontend/backend.

### ✅ Implemented Features (Working or Functionally Complete)
#### Backend & Databases
- **User Roles**: Data models and Enums (`UserRole.CUSTOMER`, `SHOPKEEPER`, `DELIVERY_PARTNER`, `ADMIN`) are correctly set up.
- **Location & Discovery (Nearby Stores)**: Implemented using the Haversine formula in raw SQL (`stores.service.ts`) to calculate radius and distance dynamically.
- **Order Lifecycle**: Robust order status enums and transitions exist (`PENDING`, `PREPARING`, `PICKED_UP`, `DELIVERED`, etc.).
- **Live Delivery Tracking (WebSockets)**: `ws.gateway.ts` correctly broadcasts location updates to specific `order:{id}` rooms.
- **Inventory & Cart**: Relational models for `Store`, `Product`, `Category`, `CartItem`, and `OrderItem` are correctly linked.
- **Payments (Stripe Setup)**: A Stripe service is integrated with a webhook controller for capturing online payments.

#### Frontend (Web & Mobile Stubs)
- **Routing**: Next.js (Web) has routes for `/admin`, `/checkout`, `/delivery`, `/explore`, `/shopkeeper`, and Expo (Mobile) has groups for `(auth)`, `(customer)`, `(delivery)`.

---

### ❌ Missing / Incomplete Features (Action Required)

> [!WARNING]
> These features are critical for your MVP based on the requirements but require further implementation.

#### 1. Typo-Tolerant Search
- **Current State**: Search is implemented using basic Postgres `ILIKE` queries in `products.service.ts`.
- **Required**: Needs integration with Elasticsearch, Meilisearch, or Postgres full-text search (`tsvector` & `pg_trgm`) to handle typos and autocomplete suggestions efficiently.

#### 2. Live Map Tracking (Frontend)
- **Current State**: The backend WebSocket emits location data, and `expo-location` is present for grabbing rider coordinates.
- **Required**: `react-native-maps` (for mobile) and a web map library (like `react-map-gl` or `leaflet`) are missing. We need a Maps provider to render the visual routes and live ETA.

#### 3. Voice Search (Mobile)
- **Current State**: No voice recognition libraries found in Expo package.json.
- **Required**: Add `@react-native-voice/voice` or `expo-speech` to enable voice search on mobile.

#### 4. Payments (UPI & Wallets)
- **Current State**: Only Stripe is configured. `PaymentMethod` enum only supports `ONLINE` and `COD`.
- **Required**: For UPI and Indian payment methods, **Razorpay** or **Cashfree** integration is highly recommended. The enums need updating to explicitly handle wallets and partial payments.

#### 5. Push Notifications (FCM)
- **Current State**: `notifications.service.ts` exists and handles Firebase Cloud Messaging (FCM) tokens.
- **Required**: Needs a real Firebase Service Account JSON added to the server environment, and frontend integration for receiving push notifications (Expo Push Notifications or React Native Firebase).

---

### ⚙️ Configuration & API Keys Needed for Production Readiness

> [!IMPORTANT]
> To make the application fully functional, you must gather and configure the following API keys and services in your `.env` files.

1. **Stripe / Razorpay**:
   - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for card payments.
   - Razorpay keys if you want UPI support.
2. **Firebase Cloud Messaging (FCM)**:
   - Firebase Admin SDK Service Account JSON for the backend to push notifications.
3. **Mapping & Routing**:
   - **Google Maps API Key** or **Mapbox Access Token**. (Needed for both the frontend map rendering and backend Route Optimization / ETA calculation if you want accurate traffic data rather than just crow-flight radius).
4. **Twilio / SMS Provider** (Fallback):
   - For OTP logins and SMS updates when push notifications fail.
5. **AWS S3 / Cloudinary**:
   - Needed for KYC document uploads and product images (currently assumed to be local or basic URLs).
