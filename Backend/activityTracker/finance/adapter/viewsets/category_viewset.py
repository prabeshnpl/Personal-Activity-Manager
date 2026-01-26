from rest_framework.permissions import IsAuthenticated
from finance.adapter.serializers.category_serializer import CategorySerializer
from finance.data.db.category_impl import CategoryRepositoryImpl
from finance.domain.usecase.category_usecase import CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryByIdUseCase, ListCategoriesUseCase, UpdateCategoryUseCase
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from utils.tenantViewsets import BaseTenantModelViewSet

class CategoryViewset(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = CategoryRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    pagination_class = CustomPageNumberPagination

    require_organization = True

    def retrieve(self, request, pk:int):
        usecase = GetCategoryByIdUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
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
        usecase = ListCategoriesUseCase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        entities = usecase.execute(search_params=search_params, organization=request.organization,role=request.role)

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
        usecase = DeleteCategoryUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
        if isinstance(response, Response):
            return response
        return Response({'detail':"Deleted successfully"})
    
    def create(self, request, *args, **kwargs):
        usecase = CreateCategoryUseCase(repo=self.repository())
        data = request.data

        entity = usecase.execute(data=data, organization=request.organization,role=request.role)

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
    
    def update(self, request, pk):
        data = request.data

        usecase = UpdateCategoryUseCase(repo=self.repository())
        entity = usecase.execute(id=pk, data=data, organization=request.organization, role=request.role)

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