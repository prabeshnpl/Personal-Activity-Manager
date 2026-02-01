from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from user.adapter.serializers.login_token_serializer import LoginTokenSerializer
from user.domain.entity.token_entity import TokenEntity

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            email=request.data.get("email"),
            password=request.data.get("password"),
        )

        if not user:
            return Response({"detail": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        entity = TokenEntity(access=access, user=user) # type: ignore
        serializer = LoginTokenSerializer(
            entity,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            })

        response = Response(serializer.data)

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True, # JS cannot read   
            secure=False,  # For https only      
            samesite="None",  # Forbid cross site   
            max_age=7 * 24 * 60 * 60, # 7 days
            path="/",  # limit scope(important)
        )

        return response
