from datetime import datetime

class UserHistoryLocal:
    def __init__(self):
        self.history = []

    def save_message(self, user_id, user_input, ai_response):
        self.history.append({
            "user_id": user_id,
            "user_input": user_input,
            "ai_response": ai_response,
            "timestamp": datetime.now()
        })

    def get_conversation(self, user_id, limit=100):
        messages = [msg for msg in self.history if msg["user_id"] == user_id]
        messages.sort(key=lambda x: x["timestamp"], reverse=True)
        return list(reversed(messages[:limit]))
