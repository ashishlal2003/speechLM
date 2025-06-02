from pydantic import BaseModel

class UserProfileResponse(BaseModel):
    username: str
    email: str