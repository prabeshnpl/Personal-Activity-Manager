from user.domain.entity.token_entity import TokenEntity
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginImpl:
    def login_user(self, data) -> TokenEntity | Response:
        try:
            email = data.get("email")
            password = data.get("password")
  
            user =  authenticate(email=email, password=password)

            if not user:
                return Response({'detail':"Invalid credentials."}, status=400)

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
            access = _dict["access"],
            user = _dict["user"],
        )