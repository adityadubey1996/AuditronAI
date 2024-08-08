# db_connection.py
from mongoengine import connect
import os

def get_db_connection():
    db_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/myAIDatabase')
    return connect(host='mongodb+srv://adityadubey:1234@cluster0.bzu5sg9.mongodb.net/')

# You can call this function in other modules to establish a DB connection
