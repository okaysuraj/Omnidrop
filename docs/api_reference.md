# API Reference

The Omnidrop API is hosted at `/api` and is fully documented via OpenAPI/Swagger.
When the backend is running locally, interactive documentation is available at `http://127.0.0.1:8000/docs`.

## Authentication

### `POST /api/auth/register`
Create a new account.
- **Payload**: `email` (string), `password` (string), `full_name` (string), `role` (string: `"user"`, `"seller"`, or `"rider"`).
- **Returns**: User object.

### `POST /api/auth/login`
Authenticate and retrieve a JWT token.
- **Payload**: `email`, `password`.
- **Returns**: `access_token`, `token_type`.

### `GET /api/auth/me`
Retrieve the currently authenticated user's profile. Requires JWT token.

## Products & Categories

### `GET /api/categories`
List all product categories.

### `GET /api/products`
Retrieve a paginated list of products.
- **Query Params**: `page` (int), `search` (string), `category_slug` (string), `store_id` (int).
- **Note**: Providing `store_id` triggers Hyper-Local Inventory Logic, which updates the product stock with local quantities and removes locally out-of-stock items.

### `GET /api/products/{slug}`
Retrieve details for a single product by its slug.
- **Query Params**: `store_id` (int).

## Cart Operations

*All Cart endpoints require an active JWT token.*

### `GET /api/cart`
Retrieve the current user's active cart.

### `POST /api/cart/items`
Add a product to the cart.
- **Payload**: `product_id` (int), `quantity` (int).

### `PATCH /api/cart/items/{item_id}`
Update the quantity of an item in the cart.

### `DELETE /api/cart/items/{item_id}`
Remove an item from the cart.

## Orders & Checkout

*All Order endpoints require an active JWT token.*

### `POST /api/orders/checkout`
Convert the active cart into a confirmed order.
- **Payload**: `shipping_address` (string).
- **Returns**: Order details.

### `GET /api/orders`
Retrieve the user's order history.

### `GET /api/orders/{id}`
Retrieve a specific order's details.

## Dark Stores

### `GET /api/stores/nearest`
Find the closest dark store for fulfillment.
- **Query Params**: `lat` (float), `lng` (float), `pincode` (string).
- **Returns**: Dark Store object.

## AI Copilot

*Requires a valid `GEMINI_API_KEY` in your `.env`.*

### `POST /api/ai/chat`
Interact with the Gemini AI Copilot.
- **Payload**: `message` (string).
- **Requires**: JWT Token (so the AI can add items to your cart on your behalf).
- **Returns**: AI Response text and triggered tool actions.

### `GET /api/ai/delivery-estimate`
Get a predictive, dynamic delivery estimate based on store and user coordinates.
- **Query Params**: `store_id` (int), `lat` (float), `lng` (float).
