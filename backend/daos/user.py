from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
import bcrypt
from bson import ObjectId

load_dotenv()

class User:
    def __init__(self, db_url=os.getenv("MONGO_URI"), db_name="chat_db", collection_name="users"):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def create_user(self, username, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now()
        }
        self.collection.insert_one(user)

    def get_user(self, email):
        user = self.collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
    
    def get_user_by_email(self, email):
        user = self.collection.find_one({"email": email})
        return user

    def get_user_by_id(self, user_id):
        user = self.collection.find_one({"_id": user_id})
        return user
    
    def update_user(self, user_id, username, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        self.collection.update_one({"_id": user_id}, {"$set": {"username": username, "email": email, "password": hashed_password}})

    def delete_user(self, user_id):
        self.collection.delete_one({"_id": user_id})