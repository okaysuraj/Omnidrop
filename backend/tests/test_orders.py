import pytest
from app.models import Product, User, DarkStore, StoreInventory

@pytest.fixture
def buyer_token(client):
    client.post(
        "/api/auth/register",
        json={"email": "buyer@test.com", "password": "password123", "full_name": "Test Buyer", "role": "user"}
    )
    res = client.post("/api/auth/login", json={"email": "buyer@test.com", "password": "password123"})
    return res.json()["access_token"]

@pytest.fixture
def test_product(client, db):
    # Just insert directly
    prod = Product(name="Test Bread", description="Loaf", price=2.99, stock=50, slug="test-bread")
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

def test_add_to_cart(client, buyer_token, test_product):
    res = client.post(
        "/api/cart/items",
        headers={"Authorization": f"Bearer {buyer_token}"},
        json={"product_id": test_product.id, "quantity": 2}
    )
    assert res.status_code == 200 or res.status_code == 201
    
    # Check cart
    cart_res = client.get("/api/cart/", headers={"Authorization": f"Bearer {buyer_token}"})
    assert cart_res.status_code == 200
    data = cart_res.json()["items"]
    assert len(data) == 1
    assert data[0]["quantity"] == 2
    assert data[0]["product"]["id"] == test_product.id

def test_checkout(client, buyer_token, test_product):
    # Add to cart
    client.post(
        "/api/cart/items",
        headers={"Authorization": f"Bearer {buyer_token}"},
        json={"product_id": test_product.id, "quantity": 1}
    )
    
    # Checkout
    res = client.post(
        "/api/orders/checkout",
        headers={"Authorization": f"Bearer {buyer_token}"},
        json={"shipping_address": "123 Delivery St"}
    )
    assert res.status_code == 200 or res.status_code == 201
    order = res.json()
    assert order["status"] == "paid"
    assert float(order["total"]) == 2.99
    
    # Check cart is empty
    cart_res = client.get("/api/cart/", headers={"Authorization": f"Bearer {buyer_token}"})
    assert len(cart_res.json()["items"]) == 0
    
    # Check order was created
    orders_res = client.get("/api/orders/", headers={"Authorization": f"Bearer {buyer_token}"})
    assert len(orders_res.json()) == 1
    assert orders_res.json()[0]["id"] == order["id"]
