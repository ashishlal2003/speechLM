from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import authentication, profile
app = FastAPI()

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(processing.router, tags=["Processing"])
app.include_router(authentication.router, tags=["Authentication"])
app.include_router(profile.router, tags=["Profile"])

@app.get("/")
def home():
    return {"message": "Hello World"}