# user_history.py
from pymongo import MongoClient
from datetime import datetime
import os

class UserHistory:
    def __init__(self, db_url=os.getenv("MONGO_URI"), db_name="chat_db", collection_name="history"):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def save_message(self, user_id, user_input, ai_response):
        self.collection.insert_one({
            "user_id": user_id,
            "user_input": user_input,
            "ai_response": ai_response,
            "timestamp": datetime.now()
        })

    def get_conversation(self, user_id, limit=100):
        messages = list(self.collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit))
        messages.reverse()
        return messages