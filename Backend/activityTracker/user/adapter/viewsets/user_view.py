from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user.adapter.serializers.login_token_serializer import LoginTokenSerializer
from user.adapter.serializers.user_serializer import CustomUserSerializer
from user.data.db.user_impl import CustomUserRepoImpl
from user.domain.usecase.user_usecase import CreateCustomUserUseCase
from user.models import CustomUser
from utils.pagniator import CustomPageNumberPagination


class CreateUserView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = CustomUserRepoImpl

    def post(self, request):
        # Create user
        serializer = CustomUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usecase = CreateCustomUserUseCase(repo=self.repository())
        data = serializer.validated_data
        response = usecase.execute(data=data) # type: ignore
        if isinstance(response, Response):
            return response 

        return Response(LoginTokenSerializer(response, context={"timezone": request.headers.get("X-Timezone"), "request":request}).data, status=status.HTTP_201_CREATED)

# class CustomUserView(APIView):
#     parser_classes = [JSONParser, MultiPartParser, FormParser]
#     repository = CustomUserRepositoryImpl
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # get user by id
#         usecase = GetCustomUserByIdUsecase(repo=self.repository())
#         entity, response = usecase.execute(id=request.user.id)
#         if response:
#             return response
#         return Response(GetUserSerializer(entity, context={'request': request}).data)

#     def patch(self, request):
#         # update user data
#         try:
#             data = request.data.copy()
#             address_str = request.data.get("address", None)
#             if address_str is not None:
#                 address_dict = json.loads(address_str)
#                 data["address"] = address_dict

#             usecase = UpdateCustomUserUsecase(repo=self.repository())
#             entity, response = usecase.execute(id=request.user.id, data=data)

#             if response:
#                 return response
            
#             return Response(GetUserSerializer(entity, context={'request': request}).data)
#         except Exception as e:
#             return Response({'detail':str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk=None):
#         if pk:
#             company_type = request.query_params.get("type", None)
#             usecase = DeleteCustomUserUsecase(repo=self.repository())
#             response = usecase.execute(current_user=request.user, company_type=company_type, pk=pk)
#             return response
