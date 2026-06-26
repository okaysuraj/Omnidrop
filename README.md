# Omnidrop 

Omnidrop is a modern, premium **Quick Commerce** platform delivering fresh groceries, organic produce, and daily essentials from local dark stores to your door in under 15 minutes.

This repository features a full-stack implementation including a robust RESTful backend, a high-performance frontend, and a relational database schema optimized for inventory management.

## Key Features

- **Hyper-Local Fulfillment**: Geo-locates users and maps them to the nearest active dark store for rapid delivery. Stock levels dynamically update based on the localized inventory.
- **AI-Powered Shopping & Delivery Estimates**: Features a floating AI chatbot powered by Google Gemini (GenAI) that can answer product queries, act as an AI shopping assistant, and automatically add items to your cart via Function Calling. It also generates real-time delivery estimates.
- **Premium User Experience**: Designed with modern UI/UX principles (glassmorphism, vibrant colors, micro-animations) utilizing React and Tailwind CSS v4.
- **Three-Tier Role Management**: Supports **Customers** (browsing/purchasing), **Sellers** (inventory management), and **Riders** (delivery fulfillment).
- **Automated Test Suites**: Comprehensive end-to-end testing with Pytest on the backend and Vitest/React Testing Library on the frontend.
- **Secure Architecture**: JWT-based authentication with bcrypt password hashing.

## Documentation

Comprehensive project documentation is available in the [`docs/`](./docs) directory:

- 🏗️ **[Architecture Overview](./docs/architecture.md)**: Deep dive into the tech stack and system components.
- 🚀 **[Setup Guide](./docs/setup_guide.md)**: Step-by-step instructions to run the application locally with Neon Cloud PostgreSQL.
- 📖 **[API Reference](./docs/api_reference.md)**: Full details on all backend REST endpoints.

## Stack Summary

- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.0, Neon Cloud PostgreSQL, Pytest
- **AI Integration:** Google GenAI (Gemini 2.5 Flash)
- **Frontend:** Node.js 20+, React 19, Vite, Tailwind CSS v4, Vitest

---
*Created as a demonstration of advanced full-stack development, AI tool calling, and modern aesthetic UI design.*
