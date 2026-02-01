from typing import List, Optional
from organization.models import Member, Organization
from user.domain.entity.token_entity import TokenEntity
from user.domain.entity.user_entity import CustomUserEntity
from user.domain.repository.user_repo import CustomUserRepository
from rest_framework.response import Response
from django.db import transaction
from user.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class CustomUserRepoImpl(CustomUserRepository):
    def create_user(self, data: dict) -> Optional[TokenEntity] | Optional[Response]:
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

                organization = Organization.objects.create(
                    name=f"{user.first_name} {user.last_name}",
                    type="personal",
                    created_by=user
                )
                member = Member.objects.create(
                    organization=organization,
                    user=user,
                    role="owner"
                )

                refresh = RefreshToken.for_user(user) # type: ignore

                return self.to_token_entity({
                        "access": str(refresh.access_token),
                        "user": user,
                    }), refresh # type: ignore
        except Exception as e:
            print(f"Error occured while creating user:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def update_user(self, id: int, data: dict, organization:int, role:str) -> CustomUserEntity | None | Response:
        try:
            user = CustomUser.objects.get(id=id)
            member = Member.objects.filter(user=user, organization=organization).first()
            if not member:
                return Response({'detail':'You are not allowed!!'}, status=400)

            for key, value in data.items():
                setattr(user, key, value)    
            user.save()
        
            return self.to_user_entity(user)
        
        except Exception as e:
            print(f'Error while updating user: {repr(e)}')
            return Response({'detail':f'{str(e)}'}, status=500)
        
    def get_user_by_id(self, id: int, organization:int, role:str) -> CustomUserEntity | None | Response:
        try:
            user = CustomUser.objects.get(organization=organization, id=id)
            return self.to_user_entity(user)
        except Exception as e:
            return Response({'detail':f'{str(e)}'}, status=500)
        
    def delete_user(self, id: int, organization:int, role:str) -> None | Response:
        try:
            user = CustomUser.objects.get(organization=organization, id=id)
            user.delete()
            return Response({'detail':'deleted successfully'})
        except Exception as e:
            return Response({'detail':f'{str(e)}'}, status=500)

    def list_user(self, organization:int, role:str, search_params: Optional[dict]=None) -> List[CustomUserEntity] | None | Response:
        try:
            print(CustomUser.objects.all())
            users = CustomUser.objects.\
                filter(memberships__organization=organization).\
                only(
                    "id",
                    "email",
                    "username",
                    "first_name",
                    "last_name",
                    "contact_number",
                    "created_at",
                    "updated_at",
                    "profile_picture",
                )
            print(users)
            return [self.to_user_entity(user) for user in users]
        except Exception as e:
            return Response({'detail':f'{str(e)}'}, status=500)
    
    def to_token_entity(self, _dict):
        return TokenEntity(
            access = _dict["access"],
            user = _dict["user"],
        )
    
    def to_user_entity(self, user:CustomUser):
        return CustomUserEntity(
            id=user.id, # type: ignore
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            contact_number=user.contact_number,
            created_at=user.created_at,
            updated_at=user.updated_at,
            profile_picture=user.profile_picture
        )
