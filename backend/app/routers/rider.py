from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.deps import require_rider, get_current_user
from app.models import User, Order, OrderStatus, OrderItem

router = APIRouter(prefix="/rider", tags=["rider"])

@router.get("/orders")
def get_available_orders(
    current_user: User = Depends(require_rider), db: Session = Depends(get_db)
):
    # Riders can see orders that are PAID (ready for pickup) or SHIPPED (currently out for delivery)
    orders = (
        db.query(Order)
        .filter(Order.status.in_([OrderStatus.PAID, OrderStatus.SHIPPED]))
        .order_by(desc(Order.created_at))
        .all()
    )
    
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "status": order.status.value,
            "total": float(order.total),
            "shipping_address": order.shipping_address,
            "created_at": order.created_at.isoformat(),
            "item_count": sum(item.quantity for item in order.items)
        })
        
    return result

@router.patch("/orders/{order_id}/accept")
def accept_order(
    order_id: int,
    current_user: User = Depends(require_rider),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status != OrderStatus.PAID:
        raise HTTPException(status_code=400, detail="Order is not ready for pickup")
        
    order.status = OrderStatus.SHIPPED # Maps to "Out for Delivery"
    db.commit()
    db.refresh(order)
    
    return {"id": order.id, "status": order.status.value}

@router.patch("/orders/{order_id}/deliver")
def deliver_order(
    order_id: int,
    current_user: User = Depends(require_rider),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.status != OrderStatus.SHIPPED:
        raise HTTPException(status_code=400, detail="Order is not out for delivery")
        
    order.status = OrderStatus.DELIVERED
    db.commit()
    db.refresh(order)
    
    return {"id": order.id, "status": order.status.value}
