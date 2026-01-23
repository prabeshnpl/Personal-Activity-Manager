from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from user.adapter.serializers.login_token_serializer import LoginTokenSerializer
from user.data.db.login_impl import LoginImpl

class LoginView(APIView):
    
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        data = request.data
        repo = LoginImpl()
        
        response = repo.login_user(data=data)
        if isinstance(response, Response):
            return response
        
        response = Response(LoginTokenSerializer(response, context={"timezone": request.headers.get("X-Timezone"), "request":request}).data, status=status.HTTP_200_OK)

        return response

