from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt_auth import verify_jwt
from middlewares.user import get_current_user

router = APIRouter()
security = HTTPBearer()

@router.get('/profile')
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Authenticated user profile",
        "user": {
            "id": current_user.get("sub"),
            "username": current_user.get("username"),
        }
    }