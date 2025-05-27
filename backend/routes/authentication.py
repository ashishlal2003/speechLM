from fastapi import HTTPException, status, APIRouter
from daos.user import User
import bcrypt
from utils.jwt_auth import create_access_token, verify_jwt
from pydantic import BaseModel

router = APIRouter()

user = User()

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenData(BaseModel):
    token: str

@router.post("/register")
def register(req: RegisterRequest):
    if user.get_user(req.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user.create_user(req.username, req.email, req.password)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(req: LoginRequest):
    curr = user.get_user(req.email)
    
    if not curr:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    hashed = curr["password"].encode()
    match = bcrypt.checkpw(req.password.encode(), hashed)

    print("Math:", match)

    if not match:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(curr["_id"]), "email": curr["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(user_id: str):
    return {"message": "User logged out successfully"}

@router.post("/is_authenticated")
def is_authenticated(req: TokenData):
    payload = verify_jwt(req.token)

    if not payload:
        return {"is_authenticated": False}
    
    return {"is_authenticated": True}
