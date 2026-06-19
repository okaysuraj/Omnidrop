from app.database import SessionLocal, Base, engine
from app.seed import _seed_dark_stores

def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        _seed_dark_stores(db)
        db.commit()
        print("Stores seeded successfully")
    except Exception as e:
        print("Error:", e)
    finally:
        db.close()

if __name__ == "__main__":
    run()
