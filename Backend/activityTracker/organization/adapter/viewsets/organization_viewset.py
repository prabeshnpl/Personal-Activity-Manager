from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from organization.adapter.serializers.organization_serializer import OrganizationSerializer
from organization.data.db.organization_impl import OrganizationRepositoryImpl
from organization.domain.usecase.organization_usecase import GetOrganizationByIdUseCase, ListOrganizationsUseCase
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response

class OrganizationViewset(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = OrganizationRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer
    pagination_class = CustomPageNumberPagination

    def retrieve(self, request, pk:int):
        usecase = GetOrganizationByIdUseCase(repo=self.repository())
        response = usecase.execute(id=pk)
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
        usecase = ListOrganizationsUseCase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        entities = usecase.execute(search_params=search_params)

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
       
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    

    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)