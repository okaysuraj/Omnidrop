import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DarkStore
from app.schemas import DarkStoreOut

router = APIRouter(tags=["stores"])

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/stores", response_model=list[DarkStoreOut])
def get_all_stores(db: Session = Depends(get_db)):
    stores = db.query(DarkStore).filter(DarkStore.is_active == True).all()
    return stores

@router.get("/stores/nearest", response_model=DarkStoreOut)
def get_nearest_store(lat: float, lng: float, db: Session = Depends(get_db)):
    stores = db.query(DarkStore).filter(DarkStore.is_active == True).all()
    if not stores:
        raise HTTPException(status_code=404, detail="No active stores found")

    nearest_store = None
    min_distance = float('inf')

    for store in stores:
        dist = haversine(lat, lng, float(store.latitude), float(store.longitude))
        if dist < min_distance:
            min_distance = dist
            nearest_store = store

    return nearest_store
