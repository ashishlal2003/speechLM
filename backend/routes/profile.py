from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from middlewares.user import get_current_user
from daos.user import UserDB 
from schemas.profile_schema import UserProfileResponse

router = APIRouter()
security = HTTPBearer()

user = UserDB()

@router.get('/profile',response_model=UserProfileResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user_exist = user.get_user(email)

    if not user_exist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not Exist")
    
    # return {
    #     "message": "Authenticated user profile",
    #     "user": user_exist
    # }
    return UserProfileResponse(
        username=user_exist.get("username"),
        email=user_exist.get("email"),
        general_agents=user_exist.get("general_agents"),
        research_agents=user_exist.get("research_agents"),
        shopping_agents=user_exist.get("shopping_agents")
    )