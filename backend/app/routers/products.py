from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Product, StoreInventory
from app.schemas import ProductListOut, ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListOut)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=48),
    search: str | None = None,
    category_slug: str | None = None,
    sort_by: str | None = None,
    store_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category))
    if store_id is not None:
        query = query.options(joinedload(Product.store_inventory))
        
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(Product.name.ilike(term) | Product.description.ilike(term))
    if category_slug:
        query = query.join(Product.category).filter(
            Product.category.has(slug=category_slug)
        )
        
    if store_id is not None:
        query = query.join(StoreInventory).filter(
            StoreInventory.store_id == store_id,
            StoreInventory.stock > 0
        )
        
    total = query.count()

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.name)

    items = (
        query
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    
    # Override global stock with local stock if store_id is provided
    if store_id is not None:
        for item in items:
            inv = next((inv for inv in item.store_inventory if inv.store_id == store_id), None)
            if inv:
                item.stock = inv.stock
                
    return ProductListOut(items=items, total=total, page=page, page_size=page_size)


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, store_id: int | None = None, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(joinedload(Product.category), joinedload(Product.store_inventory))
        .filter(Product.slug == slug)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    if store_id is not None:
        inv = next((inv for inv in product.store_inventory if inv.store_id == store_id), None)
        product.stock = inv.stock if inv else 0
        
    return product
