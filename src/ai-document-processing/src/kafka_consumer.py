# kafka_consumer.py
from kafka import KafkaConsumer, KafkaProducer
import json
import logging
from .ai_service import process_request
from config.kafka_config import KAFKA_BROKER_URL, INPUT_TOPIC, OUTPUT_TOPIC

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def start_kafka_consumer():
    consumer = KafkaConsumer(
        INPUT_TOPIC,
        bootstrap_servers=KAFKA_BROKER_URL,
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BROKER_URL,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )

    for message in consumer:
        logger.info("Received message: %s", message.value)
        response = process_request(message.value)
        producer.send(OUTPUT_TOPIC, value=response)
        logger.info("Sent response: %s", response)

if __name__ == '__main__':
    start_kafka_consumer()
