from datetime import datetime
import bcrypt

class User:
    def __init__(self, username: str, email: str, password: str):
        self.username = username
        self.email = email
        self.password = self._hash_password(password)
        self.created_at = datetime.now()
        self.general_agents = []
        self.research_agents = []
        self.shopping_agents = []

    def _hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def to_dict(self) -> dict:
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "created_at": self.created_at,
            "general_agents": self.general_agents,
            "research_agents": self.research_agents,
            "shopping_agents": self.shopping_agents
        }
