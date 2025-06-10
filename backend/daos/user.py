from datetime import datetime, timedelta, timezone
from pymongo import MongoClient
from bson.objectid import ObjectId
from models.user import User
import os
from dotenv import load_dotenv

load_dotenv()

class UserDB:
    def __init__(self, db_url=os.getenv("MONGO_URI"), db_name="chat_db", collection_name="users"):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def set_otp(self, email, otp_code, expiry_minutes=10):
        expiry = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        self.collection.update_one(
            {"email": email},
            {"$set": {"otp": otp_code, "otp_expiry": expiry}}
        )

    
    def verify_otp(self, email, otp_code):
        user = self.collection.find_one({"email": email})
        print("ot", otp_code)
        if not user:
            return False

        if user.get("otp") != otp_code:
            return False

        otp_expiry = user.get("otp_expiry")
        if not otp_expiry:
            return False

        if isinstance(otp_expiry, str):
            try:
                otp_expiry = datetime.fromisoformat(otp_expiry)
            except ValueError:
                return False

        if otp_expiry.tzinfo is None:
            otp_expiry = otp_expiry.replace(tzinfo=timezone.utc)

        if otp_expiry < datetime.now(timezone.utc):
            return False

        self.collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True}, "$unset": {"otp": "", "otp_expiry": ""}}
        )

        return True



    def create_user(self, username, email, password):
        user = User(username, email, password)
        self.collection.insert_one(user.to_dict())

    def get_user(self, email):
        user = self.collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    def get_user_by_email(self, email):
        return self.collection.find_one({"email": email})

    def get_user_by_id(self, user_id):
        return self.collection.find_one({"_id": ObjectId(user_id)})

    def update_user(self, user_id, username, email, password):
        existing_user = self.collection.find_one({"_id": ObjectId(user_id)})
        if existing_user:
            updated_user = User(username, email, password)
            user_dict = updated_user.to_dict()
            user_dict["_id"] = existing_user["_id"]
            self.collection.replace_one({"_id": existing_user["_id"]}, user_dict)
            return user_dict
        return None

    def delete_user(self, user_id):
        self.collection.delete_one({"_id": ObjectId(user_id)})
