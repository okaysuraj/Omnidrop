import pytest
from app.models import Product, User, DarkStore, StoreInventory

@pytest.fixture
def test_seller(client, db):
    # Register seller
    client.post(
        "/api/auth/register",
        json={"email": "seller@test.com", "password": "password123", "full_name": "Test Seller", "role": "seller"}
    )
    user = db.query(User).filter(User.email == "seller@test.com").first()
    return user

@pytest.fixture
def seller_token(client, test_seller):
    response = client.post("/api/auth/login", json={"email": "seller@test.com", "password": "password123"})
    return response.json()["access_token"]

def test_list_products_empty(client):
    response = client.get("/api/products/")
    assert response.status_code == 200
    assert response.json()["items"] == []

def test_create_and_list_product(client, test_seller, seller_token, db):
    # Create product as seller
    response = client.post(
        "/api/seller/products",
        headers={"Authorization": f"Bearer {seller_token}"},
        json={"name": "Apple", "description": "Fresh", "price": 1.99, "stock": 100}
    )
    assert response.status_code == 200
    product_id = response.json()["id"]

    # List as general user
    res = client.get("/api/products/")
    assert res.status_code == 200
    data = res.json()["items"]
    assert len(data) == 1
    assert data[0]["name"] == "Apple"

def test_hyperlocal_inventory(client, test_seller, seller_token, db):
    # 1. Create Product
    client.post(
        "/api/seller/products",
        headers={"Authorization": f"Bearer {seller_token}"},
        json={"name": "Banana", "description": "Yellow", "price": 0.50, "stock": 100} # Global stock 100
    )
    
    prod = db.query(Product).filter(Product.name == "Banana").first()
    
    # 2. Create Dark Store
    store = DarkStore(name="Downtown Hub", address="123 Main", latitude=0, longitude=0)
    db.add(store)
    db.commit()
    
    # 3. Request without store_id returns global stock
    res1 = client.get("/api/products/")
    assert res1.json()["items"][0]["stock"] == 100
    
    # 4. Request with store_id returns empty (since no store inventory)
    res2 = client.get(f"/api/products/?store_id={store.id}")
    assert res2.json()["items"] == []
    
    # 5. Seller updates store inventory
    client.post(
        f"/api/seller/inventory/{store.id}",
        headers={"Authorization": f"Bearer {seller_token}"},
        json={"product_id": prod.id, "stock": 5}
    )
    
    # 6. Request with store_id returns 5
    res3 = client.get(f"/api/products/?store_id={store.id}")
    assert res3.json()["items"][0]["stock"] == 5
