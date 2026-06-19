from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import SessionLocal
from app.models import Category, Product, User, DarkStore, StoreInventory

DEMO_EMAIL = "demo@example.com"
DEMO_PASSWORD = "demo1234"


def seed_database() -> None:
    db: Session = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            _seed_catalog(db)
            _seed_dark_stores(db)

        _seed_demo_user(db)
        db.commit()
    finally:
        db.close()


def _seed_demo_user(db: Session) -> None:
    if db.query(User).filter(User.email == DEMO_EMAIL).first():
        return
    old = db.query(User).filter(User.email == "demo@shop.local").first()
    if old:
        db.delete(old)
    db.add(
        User(
            email=DEMO_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
            full_name="Demo User",
        )
    )


def _seed_catalog(db: Session) -> None:
    categories = [
        Category(name="Electronics", slug="electronics"),
        Category(name="Clothing", slug="clothing"),
        Category(name="Home", slug="home"),
    ]
    db.add_all(categories)
    db.flush()

    products = [
        Product(
            name="Wireless Headphones",
            slug="wireless-headphones",
            description="Noise-cancelling over-ear headphones with 30h battery life.",
            price=129.99,
            stock=50,
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            category_id=categories[0].id,
        ),
        Product(
            name="Smart Watch",
            slug="smart-watch",
            description="Fitness tracking, heart rate monitor, and notifications.",
            price=199.99,
            stock=35,
            image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            category_id=categories[0].id,
        ),
        Product(
            name="Laptop Stand",
            slug="laptop-stand",
            description="Aluminum adjustable stand for better ergonomics.",
            price=49.99,
            stock=80,
            image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
            category_id=categories[0].id,
        ),
        Product(
            name="Classic Cotton T-Shirt",
            slug="cotton-tshirt",
            description="Soft organic cotton tee in multiple colors.",
            price=24.99,
            stock=120,
            image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            category_id=categories[1].id,
        ),
        Product(
            name="Denim Jacket",
            slug="denim-jacket",
            description="Vintage wash denim jacket with modern fit.",
            price=89.99,
            stock=40,
            image_url="https://images.unsplash.com/photo-1551028714-26679be7339a?w=400",
            category_id=categories[1].id,
        ),
        Product(
            name="Ceramic Mug Set",
            slug="ceramic-mug-set",
            description="Set of 4 handcrafted mugs, dishwasher safe.",
            price=34.99,
            stock=60,
            image_url="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
            category_id=categories[2].id,
        ),
        Product(
            name="Desk Lamp",
            slug="desk-lamp",
            description="LED desk lamp with adjustable brightness and color.",
            price=59.99,
            stock=45,
            image_url="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
            category_id=categories[2].id,
        ),
        Product(
            name="Bluetooth Speaker",
            slug="bluetooth-speaker",
            description="Portable waterproof speaker with rich bass.",
            price=79.99,
            stock=70,
            image_url="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            category_id=categories[0].id,
        ),
    ]
    db.add_all(products)
    db.flush()

def _seed_dark_stores(db: Session) -> None:
    stores = [
        DarkStore(name="Downtown Hub", address="123 Main St", latitude=40.7128, longitude=-74.0060),
        DarkStore(name="Uptown Hub", address="456 Broadway", latitude=40.7306, longitude=-73.9866),
    ]
    db.add_all(stores)
    db.flush()

    products = db.query(Product).all()
    inventory = []
    for store in stores:
        for product in products:
            inventory.append(StoreInventory(store_id=store.id, product_id=product.id, stock=product.stock))
    db.add_all(inventory)
