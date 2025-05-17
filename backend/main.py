from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SessionLocal, ScrapeResult
from scraper import scrape_images
import json

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scrape")
async def scrape_urls(urls: list[str]):
    db = SessionLocal()
    results = {}
    for url in urls:
        images = await scrape_images(url)
        results[url] = images
        db.add(ScrapeResult(url=url, image_urls=json.dumps(images)))
    db.commit()
    db.close()
    return results