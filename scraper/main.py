import os
import sys

# Ensure root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import json
import logging
from datetime import datetime, timedelta
from scraper.collectors.playwright_collector import PlaywrightNetworkCollector

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ScraperOrchestrator")

CORRIDORS = [
    ("DEL", "BOM"), # Delhi to Mumbai (Trunk Metro)
    ("BLR", "DEL"), # Bengaluru to Delhi (Metro Corridor)
    ("HYD", "MAA")  # Hyderabad to Chennai (Regional Metro)
]

ADVANCE_BUCKETS = [1, 7]

def run_collection_cycle():
    logger.info("Starting Playwright dynamic web scraping collection cycle...")
    
    collector = PlaywrightNetworkCollector(target_api_keyword="flight")
    today = datetime.now()

    collected_batch = []

    for origin, destination in CORRIDORS:
        route_name = f"{origin}-{destination}"
        logger.info(f"Processing Corridor: {route_name}")

        for days_ahead in ADVANCE_BUCKETS:
            dep_date = (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
            logger.info(f"Fetching {route_name} for window {days_ahead}d (Dept Date: {dep_date})")

            flights = collector.search_flights(
                origin=origin,
                destination=destination,
                departure_date=dep_date,
                advance_days=days_ahead
            )
            collected_batch.extend(flights)

    logger.info(f"Dynamic collection complete. Captured {len(collected_batch)} flight price quotes.")

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    raw_dir = os.path.join(base_dir, "data", "raw")
    processed_dir = os.path.join(base_dir, "data", "processed")

    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)

    timestamp = today.strftime("%Y%m%d_%H%M%S")
    raw_file = os.path.join(raw_dir, f"flights_raw_{timestamp}.json")
    processed_file = os.path.join(processed_dir, f"flights_latest.json")

    with open(raw_file, "w", encoding="utf-8") as f:
        json.dump(collected_batch, f, indent=2)
    logger.info(f"Saved raw batch snapshot to: {raw_file}")

    with open(processed_file, "w", encoding="utf-8") as f:
        json.dump(collected_batch, f, indent=2)
    logger.info(f"Updated latest processed feed at: {processed_file}")

    # Auto-push to backend API and trigger index recalculation
    try:
        import requests
        backend_url = os.getenv("BACKEND_API_URL", "http://127.0.0.1:8000")
        logger.info(f"Auto-ingesting {len(collected_batch)} scraped quotes to backend at {backend_url}...")
        
        batch_res = requests.post(f"{backend_url}/api/flights/batch", json=collected_batch, timeout=10)
        if batch_res.status_code == 201:
            res_data = batch_res.json()
            logger.info(f"Backend ingested successfully: {res_data.get('records_saved', 0)} new records saved to database.")
            
            # Recalculate index
            calc_res = requests.post(f"{backend_url}/api/index/calculate", json={}, timeout=10)
            if calc_res.status_code == 200:
                logger.info("Airfare Index recalculated and synced with latest scraped data!")
        else:
            logger.warning(f"Backend returned status {batch_res.status_code}: {batch_res.text}")
    except Exception as e:
        logger.warning(f"Could not auto-sync to backend (is FastAPI server running?): {e}")

    return collected_batch

if __name__ == "__main__":
    run_collection_cycle()

