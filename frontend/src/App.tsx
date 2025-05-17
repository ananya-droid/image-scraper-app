import { useState } from 'react'
import './App.css'

function App() {
  const [inputUrls, setInputUrls] = useState('')
  const [images, setImages] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScrape = async () => {
    if (!inputUrls.trim()) {
      setError('Please enter at least one URL')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const urls = inputUrls.split('\n').filter(url => url.trim() !== '')
      const res = await fetch('http://127.0.0.1:8000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(urls),
      })
      
      if (!res.ok) throw new Error('Scraping failed')
      
      const data = await res.json()
      setImages(data)
    } catch (err) {
      setError('Failed to scrape images. Check your URLs and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Image Scraper</h1>
      
      <div className="input-container">
        <textarea
          value={inputUrls}
          onChange={(e) => setInputUrls(e.target.value)}
          placeholder="Enter URLs (one per line)"
          rows={5}
        />
        <button onClick={handleScrape} disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape Images'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {Object.entries(images).map(([url, imageUrls]) => (
          <div key={url} className="url-section">
            <h3>Images from: {url}</h3>
            <div className="image-grid">
              {imageUrls.map((imgUrl, index) => (
                <img 
                  key={index} 
                  src={imgUrl} 
                  alt={`Scraped from ${url}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'placeholder-error.png'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
