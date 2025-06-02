from daos.user_history_mongo import UserHistoryMongo
from daos.user_history_local import UserHistoryLocal
from utils.jwt_auth import verify_jwt

def get_user_history_plugin(auth_token: str | None):
    if auth_token and verify_jwt(auth_token):
        return UserHistoryMongo()
    else:
        return UserHistoryLocal()
