from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLITE_URL = "sqlite:///./scrapes.db"
engine = create_engine(SQLITE_URL)
Base = declarative_base()

class ScrapeResult(Base):
    __tablename__ = "scrapes"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    image_urls = Column(String)  # Stores JSON

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)