from datetime import datetime

class Agent:
    def __init__(self, agent_name: str, agent_type: str, user_id: str, history: list = None):
        self.agent_name = agent_name
        self.agent_type = agent_type
        self.user_id = user_id
        self.history = history or []

    def to_dict(self) -> dict:
        return {
            "agent_name": self.agent_name,
            "agent_type": self.agent_type,
            "user_id": self.user_id,
            "history": self.history
        }
