from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt_auth import verify_jwt
from middlewares.user import get_current_user
from daos.user import User 
from schemas.profile_schema import UserProfileResponse

router = APIRouter()
security = HTTPBearer()

user = User()

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
        email=user_exist.get("email")
    )