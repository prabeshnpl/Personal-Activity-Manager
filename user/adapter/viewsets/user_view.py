from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from user.adapter.serializers.login_token_serializer import LoginTokenSerializer
from user.adapter.serializers.user_serializer import CustomUserSerializer
from user.data.db.user_impl import CustomUserRepoImpl
from user.domain.usecase.user_usecase import (
    CreateCustomUserUseCase, 
    DeleteCustomUserUsecase, 
    GetCustomUserByIdUsecase, 
    UpdateCustomUserUsecase,
    ListCustomUserUsecase
)
from user.models import CustomUser
from utils.tenantViewsets import BaseTenantAPIView, BaseTenantModelViewSet
from utils.pagniator import CustomPageNumberPagination


class CreateUserView(BaseTenantAPIView):

    require_organization = False
    
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = CustomUserRepoImpl

    def post(self, request):
        # Create user
        serializer = CustomUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usecase = CreateCustomUserUseCase(repo=self.repository())
        data = serializer.validated_data
        response = usecase.execute(data=data) 
        if isinstance(response, Response):
            return response 
        
        entity, refresh = response # type: ignore
        
        response = Response(LoginTokenSerializer(
            entity, 
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        ).data, status=status.HTTP_201_CREATED)

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

class CustomUserView(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = CustomUserRepoImpl 
    permission_classes = [IsAuthenticated]
    require_organization = True
    queryset = CustomUser.objects.none()
    serializer_class = CustomUserSerializer

    def retrieve(self, request, *args, **kwargs):
        # get user by id
        id = kwargs.get('pk')
        usecase = GetCustomUserByIdUsecase(repo=self.repository())
        entity= usecase.execute(id=id, organization=request.organization, role=request.role) # type: ignore
        if isinstance(entity, Response):
            return entity
        return Response(CustomUserSerializer(entity, context={'request': request}).data)

    def update(self, request, *args, **kwargs):
        # update user data
        try:
            pk = kwargs.get('pk')
            data = request.data.copy()
            serializer = self.get_serializer(data=data, partial=kwargs.get('partial'))
            serializer.is_valid(raise_exception=True)
            usecase = UpdateCustomUserUsecase(repo=self.repository())
            entity = usecase.execute(id=pk, data=serializer.validated_data, organization=request.organization, role=request.role) # type: ignore

            if isinstance(entity, Response):
                return entity
            
            return Response(CustomUserSerializer(entity, context={'request': request}).data)
        except Exception as e:
            return Response({'detail':str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None): # type: ignore
        if pk:
            usecase = DeleteCustomUserUsecase(repo=self.repository())
            response = usecase.execute(id=pk, organization=request.organization, role=request.role)
            return response

    def list(self, request):
        usecase = ListCustomUserUsecase(repo=self.repository())
        organization = request.organization
        role = request.role
        entities = usecase.execute(organization = organization, role = role)
        if isinstance(entities, Response):
            return entities
        
        serializer = CustomUserSerializer(
            entities, many=True,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            })
        
        return Response(serializer.data)

