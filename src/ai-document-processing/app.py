# main_service.py
import logging
from schema_loader import load_schemas
from db_connection import get_db_connection
from src.kafka_consumer import start_kafka_consumer

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Initialize DB connection
    db = get_db_connection()
    logger.info("Database connection established successfully.")

    # Load schemas
    schemas = load_schemas()
    logger.info("Schemas loaded successfully: %s", list(schemas.keys()))

    # Perform a simple test operation with a loaded schema
    if 'User' in schemas:
        User = schemas['User']
        # new_user = User(username='testuser', email='test@example.com', password='testpassword')
        # new_user.save()
        # logger.info("Test user created successfully: %s", new_user.to_json())
    else:
        logger.warning("User schema not found.")

    # Start the Kafka consumer
    start_kafka_consumer()

except Exception as e:
    logger.error("An error occurred: %s", str(e))
