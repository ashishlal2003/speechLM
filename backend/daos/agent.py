from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from models.agent import Agent

class AgentDB:
    def __init__(self, db_url=os.getenv("MONGO_URI"), db_name="chat_db", agent_collection="agents", user_collection="users"):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.agent_collection = self.db[agent_collection]
        self.user_collection = self.db[user_collection]

    def create_agent(self, agent_name: str, agent_type: str, user_id: str):
        agent = Agent(agent_name, agent_type, user_id)
        result = self.agent_collection.insert_one(agent.to_dict())
        agent_id = str(result.inserted_id)

        agent_field_map = {
            "general": "general_agents",
            "research": "research_agents",
            "shopping": "shopping_agents"
        }

        field_to_update = agent_field_map.get(agent_type.lower())
        if field_to_update:
            self.user_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {field_to_update: agent_id}}
            )

        return agent_id
    
    def update_agent(self, agent_id: str, agent_name: str, agent_type: str, user_id: str) -> bool:
        # Find the agent by its ID and the user_id to ensure ownership
        result = self.agent_collection.update_one(
            {"_id": ObjectId(agent_id), "user_id": user_id},
            {"$set": {"agent_name": agent_name, "agent_type": agent_type}}
        )
        # Return True if at least one document was modified
        return result.modified_count > 0
    
    def get_agent_by_id(self, agent_id: str):
        agent = self.agent_collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            agent["_id"] = str(agent["_id"])
        return agent

    def get_agents_by_user(self, user_id: str):
        agents = self.agent_collection.find({"user_id": user_id})
        return [{**agent, "_id": str(agent["_id"])} for agent in agents]

    def save_message(self, agent_id: str, user_input: str, ai_response: str):
        agent = self.agent_collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            history = agent.get("history", [])
            history.append({
                "user_input": user_input,
                "ai_response": ai_response,
                "timestamp": datetime.now()
            })
            self.agent_collection.update_one(
                {"_id": ObjectId(agent_id)},
                {"$set": {"history": history}}
            )
            return True
        return False

    def get_conversation(self, agent_id: str, limit=100):
        agent = self.agent_collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            messages = sorted(agent.get("history", []), key=lambda x: x["timestamp"], reverse=True)
            return list(reversed(messages[:limit]))
        return []

    def delete_agent(self, agent_id: str):
        self.agent_collection.delete_one({"_id": ObjectId(agent_id)})
