# schema_loader.py
import json
import os
import logging
from mongoengine import connect, Document, StringField, IntField, FloatField, BooleanField, DateTimeField, ListField, DictField, EmbeddedDocumentField
from db_connection import get_db_connection

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Field type mappings
field_types = {
    'String': StringField,
    'Int': IntField,
    'Float': FloatField,
    'Boolean': BooleanField,
    'DateTime': DateTimeField,
    'List': ListField,
    'Dict': DictField,
    'EmbeddedDocument': EmbeddedDocumentField
}


def load_schemas(schema_file='../../src/database/schema.json'):
    schemas = {}
    # Construct the absolute path to the schema file
    absolute_schema_file = os.path.abspath(os.path.join(os.path.dirname(__file__), schema_file))
    if not os.path.exists(absolute_schema_file):
        logger.error("Schema file not found: %s", absolute_schema_file)
        raise FileNotFoundError(f"Schema file not found: {absolute_schema_file}")

    with open(absolute_schema_file, 'r') as file:
        schema_data = json.load(file)
        schema_name = schema_data['name']
        schema_def = schema_data['fields']
        
        document_fields = {
            field: field_types[prop['type']](**prop) if prop['type'] in field_types else StringField()
            for field, prop in schema_def.items()
        }
        
        document_class = type(schema_name, (Document,), document_fields)
        schemas[schema_name] = document_class
    logger.info("Models loaded: %s", list(schemas.keys()))
    return schemas

# Example usage:
if __name__ == '__main__':
    db = get_db_connection()
    schemas = load_schemas()
    logger.info("Loaded schemas: %s", schemas)
