from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Any

from app.database import get_db
from app.deps import get_current_user
from app.models import User, Order, OrderItem, Product, OrderStatus, StoreInventory, DarkStore
from app.schemas import ProductOut, ProductCreate, ProductUpdate, OrderStatusUpdate, StoreInventoryUpdate
from slugify import slugify
import uuid

router = APIRouter(prefix="/seller", tags=["seller"])

def require_seller(current_user: User = Depends(get_current_user)):
    if current_user.role != "seller":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Must be a seller.",
        )
    return current_user

@router.get("/dashboard")
def get_seller_dashboard(
    current_user: User = Depends(require_seller), db: Session = Depends(get_db)
):
    # 1. Active Orders Count (Orders containing at least one product from this seller that are pending or paid)
    # 2. Today's Revenue (Sum of unit_price * quantity for this seller's products in paid/shipped/delivered orders created today)
    # 3. Low Stock Alerts (Products from this seller where stock < 5)

    # Note: SQLite/PostgreSQL date functions differ, but since we use PostgreSQL:
    # We can just filter by orders created >= today's start at midnight.
    # For simplicity, let's just get total revenue for this seller for now.

    # Products owned by this seller
    seller_product_ids_query = db.query(Product.id).filter(Product.seller_id == current_user.id)

    # Active Orders containing seller's products
    active_orders = (
        db.query(Order)
        .join(OrderItem)
        .filter(
            OrderItem.product_id.in_(seller_product_ids_query),
            Order.status.in_([OrderStatus.PENDING, OrderStatus.PAID]),
        )
        .distinct()
        .all()
    )

    # Total Revenue (All Time for now)
    revenue = (
        db.query(func.sum(OrderItem.quantity * OrderItem.unit_price))
        .join(Order)
        .filter(
            OrderItem.product_id.in_(seller_product_ids_query),
            Order.status.in_([OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED]),
        )
        .scalar()
    ) or 0.0

    # Low stock alerts (Global stock for now, could be StoreInventory)
    low_stock_count = (
        db.query(func.count(Product.id))
        .filter(Product.seller_id == current_user.id, Product.stock < 10)
        .scalar()
    ) or 0

    # Recent orders format
    recent_orders = []
    for order in active_orders[:5]: # Top 5 active orders
        # Find which items in this order belong to the seller
        items = [
            item for item in order.items
            if item.product.seller_id == current_user.id
        ]
        total_for_seller = sum(item.quantity * item.unit_price for item in items)
        item_names = ", ".join([f"{item.product.name} (x{item.quantity})" for item in items])
        
        recent_orders.append({
            "id": f"#ORD-{order.id}",
            "time": order.created_at.strftime("%I:%M %p"),
            "status": order.status.value,
            "items": item_names,
            "total": float(total_for_seller)
        })

    return {
        "revenue": float(revenue),
        "active_orders_count": len(active_orders),
        "low_stock_count": low_stock_count,
        "recent_orders": recent_orders
    }

@router.get("/products", response_model=List[ProductOut])
def get_seller_products(
    current_user: User = Depends(require_seller), db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.seller_id == current_user.id).order_by(Product.id.desc()).all()
    return products

@router.post("/products", response_model=ProductOut)
def create_seller_product(
    data: ProductCreate,
    current_user: User = Depends(require_seller), 
    db: Session = Depends(get_db)
):
    # Generate unique slug
    base_slug = slugify(data.name)
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"

    new_product = Product(
        name=data.name,
        slug=slug,
        description=data.description,
        price=data.price,
        stock=data.stock,
        category_id=data.category_id,
        image_url=data.image_url,
        seller_id=current_user.id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.patch("/products/{product_id}", response_model=ProductOut)
def update_seller_product(
    product_id: int,
    data: ProductUpdate,
    current_user: User = Depends(require_seller), 
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id, Product.seller_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seller_product(
    product_id: int,
    current_user: User = Depends(require_seller), 
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id, Product.seller_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Optional: Delete StoreInventory or set to inactive. Let's just delete product for now if no orders depend on it heavily
    # In a real system, you'd soft delete or check foreign keys.
    db.delete(product)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete product. It may be linked to existing orders.")
    return None

@router.get("/orders")
def get_seller_orders(
    current_user: User = Depends(require_seller), db: Session = Depends(get_db)
):
    seller_product_ids_query = db.query(Product.id).filter(Product.seller_id == current_user.id)
    
    # Get all orders that have at least one item belonging to this seller
    orders = (
        db.query(Order)
        .join(OrderItem)
        .filter(OrderItem.product_id.in_(seller_product_ids_query))
        .distinct()
        .order_by(Order.created_at.desc())
        .all()
    )
    
    result = []
    for order in orders:
        # Filter items to only show seller's items for this order
        seller_items = [
            item for item in order.items
            if item.product.seller_id == current_user.id
        ]
        
        # Calculate seller's total for this order
        total = sum(item.quantity * item.unit_price for item in seller_items)
        
        result.append({
            "id": order.id,
            "status": order.status.value,
            "total": float(total),
            "shipping_address": order.shipping_address,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price)
                } for item in seller_items
            ]
        })
        
    return result

@router.patch("/orders/{order_id}/status")
def update_seller_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    current_user: User = Depends(require_seller),
    db: Session = Depends(get_db)
):
    seller_product_ids_query = db.query(Product.id).filter(Product.seller_id == current_user.id)
    
    # Find the order, ensuring it belongs to the seller
    order = (
        db.query(Order)
        .join(OrderItem)
        .filter(
            Order.id == order_id,
            OrderItem.product_id.in_(seller_product_ids_query)
        )
        .first()
    )
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or no access")
        
    order.status = data.status
    db.commit()
    db.refresh(order)
    
    return {"id": order.id, "status": order.status.value}

@router.get("/inventory/{store_id}")
def get_seller_store_inventory(
    store_id: int,
    current_user: User = Depends(require_seller),
    db: Session = Depends(get_db)
):
    # Fetch all products owned by seller
    products = db.query(Product).filter(Product.seller_id == current_user.id).all()
    
    # Fetch store inventory for these products
    inventory = db.query(StoreInventory).filter(StoreInventory.store_id == store_id).all()
    inv_map = {inv.product_id: inv.stock for inv in inventory}
    
    result = []
    for p in products:
        result.append({
            "product_id": p.id,
            "product_name": p.name,
            "global_stock": p.stock,
            "store_stock": inv_map.get(p.id, 0)
        })
    return result

@router.post("/inventory/{store_id}")
def update_seller_store_inventory(
    store_id: int,
    data: StoreInventoryUpdate,
    current_user: User = Depends(require_seller),
    db: Session = Depends(get_db)
):
    # Verify store exists
    store = db.query(DarkStore).filter(DarkStore.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # Verify product belongs to seller
    product = db.query(Product).filter(Product.id == data.product_id, Product.seller_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    inv = db.query(StoreInventory).filter(
        StoreInventory.store_id == store_id, 
        StoreInventory.product_id == data.product_id
    ).first()

    if inv:
        inv.stock = data.stock
    else:
        inv = StoreInventory(store_id=store_id, product_id=data.product_id, stock=data.stock)
        db.add(inv)
        
    db.commit()
    return {"message": "Inventory updated", "store_stock": inv.stock}
