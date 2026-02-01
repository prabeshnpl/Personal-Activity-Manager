from rest_framework.views import APIView
from rest_framework.response import Response
from user.domain.entity.token_entity import TokenEntity

class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out"})

        response.delete_cookie(
            key="refresh_token",
            path="/"
        )

        return response

    def to_entity(self, _dict):
        return TokenEntity(
            access = _dict["access"],
            user = _dict["user"],
        )