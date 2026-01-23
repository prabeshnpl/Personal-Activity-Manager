from typing import List, Optional
from user.domain.entity.token_entity import TokenEntity
from user.domain.entity.user_entity import CustomUserEntity
from user.domain.repository.user_repo import CustomUserRepository
from rest_framework.response import Response
from django.db import transaction
from user.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class CustomUserRepoImpl(CustomUserRepository):
    def create_user(self, data: dict) -> Optional[TokenEntity] | Response:
        try:
            with transaction.atomic():
                user_data = {
                    "first_name":data.get("first_name"),
                    "last_name":data.get("last_name"),
                    "email":data.get("email"),
                }

                user = CustomUser(**user_data)
                user.set_password(data.get("password"))
                user.save()

                refresh = RefreshToken.for_user(user) # type: ignore

                return self.to_token_entity({
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "user": user,
                    })
        except Exception as e:
            print(f"Error occured while creating user:{repr(e)}")
            return Response({'detail':f"{str(e)}"})
        
    def update_user(self, id: int, data: dict) -> CustomUserEntity | None | Response:
        return super().update_user(id, data)
    def get_user_by_id(self, id: int) -> CustomUserEntity | None | Response:
        return super().get_user_by_id(id)
    def delete_user(self, id: int) -> None | Response:
        return super().delete_user(id)
    def list_user(self, search_params: dict) -> List[CustomUserEntity] | None | Response:
        return super().list_user(search_params)
    
    def to_token_entity(self, _dict):
        return TokenEntity(
            refresh = _dict['refresh'],
            access = _dict["access"],
            user = _dict["user"],
        )
