from user.domain.entity.token_entity import TokenEntity
from django.db import transaction
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from user.models import CustomUser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginImpl:
    def login_user(self, data) -> TokenEntity | Response:
        try:
            with transaction.atomic():
                email = data.get("email")
                password = data.get("password")

                if user:=CustomUser.objects.filter(email=email).first():
                    if not user.is_active:
                        raise AuthenticationFailed("User is not active. Please verify your email address through the provided link in your email.")
                 
                user =  authenticate(email=email, password=password)

                refresh = RefreshToken.for_user(user) # type: ignore
                
                return self.to_entity({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": user,
                })

        except Exception as e:
            print(f"Error in login_user: {repr(e)}")
            return Response({'detail':str(e)}, status=400)
    
    def to_entity(self, _dict):
        return TokenEntity(
            refresh = _dict['refresh'],
            access = _dict["access"],
            user = _dict["user"],
        )