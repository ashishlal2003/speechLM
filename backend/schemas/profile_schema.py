from pydantic import BaseModel

class UserProfileResponse(BaseModel):
    username: str
    email: str
    general_agents: list[str]
    research_agents: list[str]
