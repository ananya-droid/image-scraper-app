import aiohttp
from bs4 import BeautifulSoup
from typing import List

async def scrape_images(url: str) -> List[str]:
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                return [img['src'] for img in soup.find_all('img') if img.get('src')]
        except Exception:
            return []  # Return empty list if scraping fails