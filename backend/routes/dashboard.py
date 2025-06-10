from fastapi import APIRouter, status, HTTPException, Depends
from middlewares.user import get_current_user
from daos.user import UserDB 
from daos.agent import AgentDB
from fastapi.security import HTTPBearer
from schemas.agent_schema import CreateAgentRequest, DeleteAgentRequest

router = APIRouter()
security = HTTPBearer()

user = UserDB()
agent = AgentDB()

@router.get('/dashboard')
def get_agents(current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user_exist = user.get_user(email)
    if not user_exist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not Exist")
    
    agents = agent.get_agents_by_user(user_exist.get("_id"))
    return agents

@router.post('/dashboard')
def create_new_agent(request: CreateAgentRequest, current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user_exist = user.get_user(email)
    if not user_exist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not Exist")
    
    agent_name = request.agent_name
    agent_type = request.agent_type
    new_agent = agent.create_agent(agent_name, agent_type, user_exist.get("_id"))

    return {"message": "Agent created successfully"}

@router.delete('/dashboard')
def delete_agent(request: DeleteAgentRequest, current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user_exist = user.get_user(email)
    if not user_exist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not Exist")
    
    agent_id = request.agent_id

    if not agent.get_agent_by_id(agent_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Agent does not Exist")
    
    agent.delete_agent(agent_id)

    return {"message": "Agent deleted successfully"}