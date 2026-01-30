from rest_framework.permissions import IsAuthenticated
from organization.adapter.serializers.member_serializer import MemberBreakdownSerializer, MemberSerializer
from organization.data.db.member_impl import MemberRepositoryImpl
from organization.domain.usecase.member_usecase import CreateMemberUseCase, UpdateMemberUseCase, DeleteMemberUseCase, GetMemberByIdUseCase, ListMembersUseCase, MemberBreakdownUsecase
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from utils.tenantViewsets import BaseTenantModelViewSet
from rest_framework.decorators import action

class MemberViewset(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = MemberRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = MemberSerializer
    pagination_class = CustomPageNumberPagination

    require_organization = True

    def retrieve(self, request, pk:int):
        usecase = GetMemberByIdUseCase(repo=self.repository())
        response = usecase.execute(
            id=pk, 
            organization=request.organization, 
            role=request.role
        )
        if isinstance(response, Response):
            return response
        response = self.get_serializer(
            response, 
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        ).data
        return Response(response)

    def list(self, request, *args, **kwargs):
        usecase = ListMembersUseCase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        search_params['organization'] = request.organization
        entities = usecase.execute(
            search_params=search_params, 
            organization=request.organization, 
            role=request.role
        )

        if isinstance(entities, Response):
            return entities
        
        serializer = self.get_serializer(
            entities, many=True, 
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )
        return Response(serializer.data)
        # page = self.paginate_queryset(entities)

        # serializer = self.get_serializer(
        #     page, many=True,
            # context={
            #     "timezone": request.headers.get("X-Timezone"), 
            #     "request":request
            # }
        # )

        # return self.get_paginated_response(serializer.data)
           
    def destroy(self, request, pk):
        usecase = DeleteMemberUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
        if isinstance(response, Response):
            return response
        return Response({'detail':"Deleted successfully"})
    
    def create(self, request, *args, **kwargs):
        usecase = CreateMemberUseCase(repo=self.repository())
        data = request.data
        data['user'] = request.user.id
        data['organization'] = request.organization.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        entity = usecase.execute(data=serializer.validated_data, organization=request.organization,role=request.role)

        if isinstance(entity, Response):
            return entity

        serializer = self.get_serializer(
            entity,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )

        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        data = request.data

        pk = (kwargs.get("pk"))
        partial=kwargs.get('partial')

        serializer = self.get_serializer(data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        usecase = UpdateMemberUseCase(repo=self.repository())
        entity = usecase.execute(id=pk, data=serializer.validated_data, organization=request.organization, role=request.role) # type: ignore

        if isinstance(entity, Response):
            return entity
        
        serializer = self.get_serializer(
            entity,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )

        return Response(serializer.data)
         
    @action(methods=['GET'], detail=False, url_path='breakdown')
    def category_breakdown(self, request):
        usecase = MemberBreakdownUsecase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        entities = usecase.execute(search_params=search_params, organization=request.organization,role=request.role)

        if isinstance(entities, Response):
            return entities
        
        serializer = MemberBreakdownSerializer(
            entities, many=True, 
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )
        return Response(serializer.data)

