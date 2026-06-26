# Omnidrop Architecture

Omnidrop is a modern, high-performance Quick Commerce platform designed for ultra-fast grocery delivery from hyper-local "dark stores". 

## Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, custom utility classes (`.glass-effect`), CSS animations
- **Routing**: React Router DOM (v6)
- **State Management**: React Context (`AuthContext`, `CartContext`)
- **Testing**: Vitest + React Testing Library + jsdom

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI/LLM**: Google GenAI (`google-genai`) with Function Calling
- **ORM**: SQLAlchemy 2.0
- **Database**: Neon Cloud PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with python-jose & passlib (bcrypt)
- **Validation**: Pydantic v2
- **Testing**: Pytest + HTTPX + coverage

## System Components

### 1. The Core API (FastAPI)
The backend acts as a stateless RESTful API exposing resources for:
- **Authentication**: Managing users, sellers, and riders (`/api/auth`).
- **Products & Categories**: Catalog browsing, filtering, and searching with support for hyper-local store overrides.
- **Cart Management**: Managing user sessions and pending purchases.
- **Order Processing**: Handling checkouts and order history.
- **Dark Stores**: Locating nearest fulfillment centers for rapid delivery.
- **AI Integration**: Chatbot and delivery estimation endpoints using Gemini.

### 2. Relational Database Schema
- **users**: Central identity table, holding credentials and a `role` field distinguishing standard buyers, sellers, and riders.
- **dark_stores**: Locations optimized for fulfillment rather than walk-in customers.
- **products & categories**: Inventory items globally available.
- **store_inventory**: Maps `products` to specific `dark_stores` with hyper-local stock levels. When a user is localized, stock levels drop or hide if not available locally.
- **orders & order_items**: Transaction records.

### 3. AI Copilot Integration
- **AIChatModal**: A floating interface on the frontend allowing users to talk to the AI.
- **Function Calling**: The backend parses natural language queries and triggers internal Python tools to search the product database, look up prices, and add items directly into the user's cart.
- **Delivery AI**: Gemini is also used during checkout to provide intelligent, contextual estimates based on the user's geographic coordinates relative to the dark store.

### 4. Frontend Architecture
The frontend is split into domain-driven pages (`HomePage`, `LoginPage`, `ProductsPage`, etc.) and wrapped in context providers for global state access. Modern glassmorphism UI principles and performance-optimized Tailwind v4 setups provide a seamless user experience.

## Security
- **Passwords**: Hashed via bcrypt before storage.
- **Tokens**: JWT access tokens issued on login, expected in the `Authorization: Bearer <token>` header for protected routes.
- **CORS**: Configured to allow cross-origin requests from the Vite dev server (`localhost:5173`).
