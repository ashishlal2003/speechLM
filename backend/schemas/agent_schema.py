from pydantic import BaseModel

class CreateAgentRequest(BaseModel):
    agent_name: str
    agent_type: str

class DeleteAgentRequest(BaseModel):
    agent_id: str

class UpdateAgentRequest(BaseModel):
    agent_id: str
    agent_name: str
    agent_type: str