from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://shop:shop_secret@localhost:5432/shop_db"
    secret_key: str = "dev-secret-change-in-production"
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"


settings = Settings()
