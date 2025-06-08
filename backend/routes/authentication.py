from fastapi import HTTPException, status, APIRouter
import bcrypt
from utils.jwt_auth import create_access_token, verify_jwt
from daos.user import User
from schemas.register_schema import RegisterRequest
from schemas.login_schema import LoginRequest
from schemas.token_schema import TokenData

from schemas.login_schema import GoogleLoginRequest
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os


router = APIRouter()

user = User()

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


@router.post("/google-login")
async def google_login(req: GoogleLoginRequest):
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            req.id_token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )

        # The 'sub' field is the unique Google I
        # The 'email' field is the user's email
        # The 'name' field is the user's full name
        google_user_id = idinfo['sub']
        google_user_email = idinfo['email']
        google_user_name = idinfo.get('name', google_user_email) # Use email if name not provided

        # Check if user already exists in your database by email
        existing_user = user.get_user(google_user_email)

        if not existing_user:
            # If user does not exist, register them
            # You might want to generate a random password or mark them as Google registered
            # For simplicity, we'll create a user with a placeholder password.
            # In a real app, you might want to handle this differently (e.g., no password for Google users)
            # Or perhaps require them to set a password if they want to also log in without Google
            generated_password = os.urandom(16).hex() # Generate a random password for new Google users
            user.create_user(google_user_name, google_user_email, generated_password)
            # Fetch the newly created user
            existing_user = user.get_user(google_user_email)


        # Now, create an access token for your application
        access_token = create_access_token(data={
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"]
        })

        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google ID token")
    except Exception as e:
        print(f"Error during Google login: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error during Google login")
