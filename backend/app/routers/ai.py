import os
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.database import get_db
from app.models import DarkStore, Product, StoreInventory, CartItem, User
from app.routers.stores import haversine
from app.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str
    store_id: int | None = None

class ChatResponse(BaseModel):
    response: str
    items_added: list[dict] = []

@router.get("/delivery-estimate")
def get_delivery_estimate(
    store_id: int,
    user_lat: float,
    user_lng: float,
    db: Session = Depends(get_db)
):
    store = db.query(DarkStore).filter(DarkStore.id == store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    distance_km = haversine(user_lat, user_lng, float(store.latitude), float(store.longitude))
    
    # Simple fallback if no API key
    if not os.environ.get("GEMINI_API_KEY"):
        time_est = max(10, int(distance_km * 5) + 5)
        return {
            "estimate_text": f"Your order is {distance_km:.1f} km away from {store.name}. Expect delivery in {time_est}-{time_est+5} minutes!"
        }

    try:
        client = genai.Client()
        prompt = (
            f"You are an AI for a hyper-local delivery app called Omnidrop. "
            f"Generate a short, friendly, 1-2 sentence delivery estimate. "
            f"The user is {distance_km:.1f} km away from the '{store.name}' store. "
            f"Assume light-to-moderate traffic. Mention the distance and give a time estimate in minutes (assume approx 5-8 mins per km + 5 mins prep). "
            f"Do not include any asterisks, bold text, or conversational filler."
        )
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        return {"estimate_text": response.text.strip()}
    except Exception as e:
        # Fallback on error
        print(f"GenAI Error: {e}")
        time_est = max(10, int(distance_km * 5) + 5)
        return {
            "estimate_text": f"Your order is {distance_km:.1f} km away from {store.name}. Expect delivery in {time_est}-{time_est+5} minutes!"
        }

@router.post("/chat", response_model=ChatResponse)
def ai_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If no API key, use fallback mock
    if not os.environ.get("GEMINI_API_KEY"):
        # Mock logic for "I want to make a pizza"
        if "pizza" in req.message.lower():
            # Find cheese and tomatoes in DB
            items_added = []
            for kw in ["Cheese", "Tomato", "Dough"]:
                prod = db.query(Product).filter(Product.name.ilike(f"%{kw}%")).first()
                if prod:
                    # Add to cart
                    cart_item = CartItem(user_id=current_user.id, product_id=prod.id, quantity=1)
                    db.add(cart_item)
                    items_added.append({"name": prod.name, "quantity": 1})
            try:
                db.commit()
            except:
                db.rollback()
                
            return {
                "response": "I see you want to make a pizza! I've added some ingredients to your cart.",
                "items_added": items_added
            }
        
        return {
            "response": "I am Omni AI! (Set GEMINI_API_KEY to enable full smart shopping).",
            "items_added": []
        }

    # With API Key, use Function Calling
    try:
        client = genai.Client()
        
        tool_declaration = {
            "function_declarations": [
                {
                    "name": "add_to_cart",
                    "description": "Call this to add ingredients or products to the user's cart.",
                    "parameters": {
                        "type": "OBJECT",
                        "properties": {
                            "items": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "product_name": {"type": "STRING", "description": "Generic name of product (e.g. 'tomato', 'flour', 'milk')"},
                                        "quantity": {"type": "INTEGER", "description": "Quantity to add"}
                                    },
                                    "required": ["product_name", "quantity"]
                                }
                            }
                        },
                        "required": ["items"]
                    }
                }
            ]
        }
        
        prompt = (
            f"You are Omni AI, a smart shopping assistant for Omnidrop (a 15-minute delivery app). "
            f"The user says: '{req.message}'. "
            f"If the user wants to buy something, cook something, or mentions products they need, "
            f"use the `add_to_cart` tool to add the logical ingredients/products. "
            f"If they don't, just respond conversationally."
        )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={"tools": [tool_declaration]}
        )

        items_added_res = []
        bot_response = ""

        # Check if the model called a function
        if response.function_calls:
            for function_call in response.function_calls:
                if function_call.name == "add_to_cart":
                    args = function_call.args
                    items = args.get("items", [])
                    
                    for item in items:
                        kw = item.get("product_name")
                        qty = item.get("quantity", 1)
                        if kw:
                            # Fuzzy search product in DB
                            # For stricter matching, we'd check StoreInventory
                            prod = db.query(Product).filter(Product.name.ilike(f"%{kw}%")).first()
                            if prod:
                                # Check if cart item exists
                                existing = db.query(CartItem).filter(
                                    CartItem.user_id == current_user.id,
                                    CartItem.product_id == prod.id
                                ).first()
                                if existing:
                                    existing.quantity += qty
                                else:
                                    new_cart_item = CartItem(user_id=current_user.id, product_id=prod.id, quantity=qty)
                                    db.add(new_cart_item)
                                items_added_res.append({"name": prod.name, "quantity": qty})
            
            try:
                db.commit()
            except Exception as e:
                db.rollback()
                print("Error adding to cart:", e)

            # Follow up with the bot
            # Since function calling requires passing the result back or just responding,
            # we'll just manually generate a friendly response acknowledging what we found.
            if items_added_res:
                names = [f"{x['quantity']}x {x['name']}" for x in items_added_res]
                bot_response = f"I've added the following items to your cart: {', '.join(names)}! Let me know if you need anything else."
            else:
                bot_response = "I tried to add those items, but we might be out of stock in your local store!"
        else:
            bot_response = response.text or "I'm here to help you shop!"

        return {
            "response": bot_response,
            "items_added": items_added_res
        }

    except Exception as e:
        print(f"GenAI Error: {e}")
        raise HTTPException(status_code=500, detail="AI Error")
