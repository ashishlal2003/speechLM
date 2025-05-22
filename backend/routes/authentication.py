from fastapi import HTTPException, status, APIRouter
from daos.user import User
import bcrypt
from utils.jwt_auth import create_access_token

router = APIRouter()

user = User()

@router.post("/register")
def register(username: str, email: str, password: str):
    user.create_user(username, email, password)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(username: str, password: str):
    curr = user.get_user(username)
    
    if not curr:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    hashed = curr["password"].encode()
    match = bcrypt.checkpw(password.encode(), hashed)

    if not match:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": str(curr["_id"]), "username": curr["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(user_id: str):
    return {"message": "User logged out successfully"}