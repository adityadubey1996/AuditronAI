# ai_service.py
import time
import json
import logging

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_request(request):
    logger.info("Processing request: %s", request)
    # Simulate long processing time
    time.sleep(5)
    response = {"status": "processed", "data": request['data']}
    logger.info("Processing complete: %s", response)
    return response
