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

ADVANCE_BUCKETS = [1, 7, 15, 30]

def send_batch_to_backend(batch_data, api_base_url=None):
    """
    Sends normalized flight quotes directly to the backend batch ingestion endpoint.
    Uses standard library urllib to avoid mandatory third-party dependencies.
    """
    if not batch_data:
        return
    if api_base_url is None:
        api_base_url = os.getenv("BACKEND_API_BASE_URL", "http://127.0.0.1:8000")
    target_url = f"{api_base_url.rstrip('/')}/api/flights/batch"

    try:
        import urllib.request
        req = urllib.request.Request(
            target_url,
            data=json.dumps(batch_data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            resp_body = response.read().decode("utf-8")
            logger.info(f"Successfully posted {len(batch_data)} records to backend API ({target_url}): {resp_body}")
    except Exception as e:
        logger.info(f"Backend API offline or unreachable ({e}). Batch remains saved in local JSON.")

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

    # Synchronize batch with Backend API
    send_batch_to_backend(collected_batch)

    return collected_batch

if __name__ == "__main__":
    run_collection_cycle()
