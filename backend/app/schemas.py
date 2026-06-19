from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import OrderStatus


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str
    price: Decimal
    stock: int
    image_url: str | None
    category: CategoryOut | None = None


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str
    price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)
    category_id: int | None = None
    image_url: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    price: Decimal | None = Field(None, gt=0)
    stock: int | None = Field(None, ge=0)
    category_id: int | None = None
    image_url: str | None = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1, max_length=255)
    role: str = "user"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    is_admin: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quantity: int
    product: ProductOut


class CartOut(BaseModel):
    items: list[CartItemOut]
    subtotal: Decimal


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1, le=99)


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1, le=99)


class CheckoutRequest(BaseModel):
    shipping_address: str = Field(min_length=10)


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quantity: int
    unit_price: Decimal
    product: ProductOut


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    total: Decimal
    shipping_address: str
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class DarkStoreOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: str
    latitude: Decimal
    longitude: Decimal
    is_active: bool

class StoreInventoryUpdate(BaseModel):
    product_id: int
    stock: int = Field(ge=0)
