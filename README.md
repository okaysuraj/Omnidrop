# ⚡ Omnidrop

A production-ready hyperlocal e-commerce marketplace (like Blinkit, Zepto, or Swiggy).

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
