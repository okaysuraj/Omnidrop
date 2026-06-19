from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import CartItem, Product, User
from app.schemas import CartItemCreate, CartItemOut, CartItemUpdate, CartOut

router = APIRouter(prefix="/cart", tags=["cart"])


def _cart_subtotal(items: list[CartItem]) -> Decimal:
    return sum(
        (Decimal(str(item.product.price)) * item.quantity for item in items),
        Decimal("0"),
    )


def _load_cart(db: Session, user_id: int) -> list[CartItem]:
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == user_id)
        .all()
    )


@router.get("", response_model=CartOut)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = _load_cart(db, current_user.id)
    return CartOut(items=items, subtotal=_cart_subtotal(items))


@router.post("/items", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == payload.product_id,
        )
        .first()
    )
    if existing:
        new_qty = existing.quantity + payload.quantity
        if product.stock < new_qty:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        existing.quantity = new_qty
        db.commit()
        db.refresh(existing)
        item = (
            db.query(CartItem)
            .options(joinedload(CartItem.product).joinedload(Product.category))
            .filter(CartItem.id == existing.id)
            .first()
        )
        return item

    item = CartItem(
        user_id=current_user.id,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    item = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.id == item.id)
        .first()
    )
    return item


@router.patch("/items/{item_id}", response_model=CartItemOut)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if item.product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    item.quantity = payload.quantity
    db.commit()
    item = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.id == item_id)
        .first()
    )
    return item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
