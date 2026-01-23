from typing import Optional
from user.domain.entity.user_entity import CustomUserEntity

class TokenEntity:
    def __init__(self,
        refresh : str, 
        access : str,
        user : Optional[CustomUserEntity],
    ):
        self.refresh = refresh
        self.access = access
        self.user = user
