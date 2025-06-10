from pymongo import MongoClient
from bson.objectid import ObjectId
from models.agent import Agent
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class AgentDB:
    def __init__(self, db_url=os.getenv("MONGO_URI"), db_name="chat_db", collection_name="agents"):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def create_agent(self, agent_name: str, agent_type: str, user_id: str):
        agent = Agent(agent_name, agent_type, user_id)
        result = self.collection.insert_one(agent.to_dict())
        return str(result.inserted_id)

    def get_agent_by_id(self, agent_id: str):
        agent = self.collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            agent["_id"] = str(agent["_id"])
        return agent

    def get_agents_by_user(self, user_id: str):
        agents = self.collection.find({"user_id": user_id})
        return [{**agent, "_id": str(agent["_id"])} for agent in agents]

    def save_message(self, agent_id: str, user_input: str, ai_response: str):
        agent = self.collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            history = agent.get("history", [])
            history.append({
                "user_input": user_input,
                "ai_response": ai_response,
                "timestamp": datetime.now()
            })
            self.collection.update_one(
                {"_id": ObjectId(agent_id)},
                {"$set": {"history": history}}
            )
            return True
        return False
    
    def get_conversation(self, agent_id: str, limit=100):
        agent = self.collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            messages = sorted(agent.get("history", []), key=lambda x: x["timestamp"], reverse=True)
            return list(reversed(messages[:limit]))
        return []

    def delete_agent(self, agent_id: str):
        self.collection.delete_one({"_id": ObjectId(agent_id)})
