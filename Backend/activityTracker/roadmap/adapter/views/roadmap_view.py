from rest_framework.permissions import IsAuthenticated
from roadmap.adapter.serializers.roadmap_serializer import RoadmapSerializer
from roadmap.data.db.roadmap_impl import RoadmapRepositoryImpl
from roadmap.domain.usecase.roadmap_usecase import (
    CreateRoadmapUseCase, DeleteRoadmapUseCase, 
    GetRoadmapByIdUseCase, RoadmapProgressUseCase, RoadmapStatsUseCase, 
    UpdateRoadmapUseCase, ListRoadmapsUseCase
)
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from utils.tenantViewsets import BaseTenantModelViewSet
from rest_framework.decorators import action


class RoadmapView(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = RoadmapRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = RoadmapSerializer
    pagination_class = CustomPageNumberPagination

    require_organization = True

    def retrieve(self, request, pk:int):
        usecase = GetRoadmapByIdUseCase(repo=self.repository())
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
        usecase = ListRoadmapsUseCase(repo=self.repository())
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
        page = self.paginate_queryset(entities)

        serializer = self.get_serializer(
            page, many=True,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )

        response = self.get_paginated_response(serializer.data)
        response.data['total_count'] = len(entities)
        return response
       
    def destroy(self, request, pk):
        usecase = DeleteRoadmapUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
        if isinstance(response, Response):
            return response
        return Response({'detail':"Deleted successfully"})
    
    def create(self, request, *args, **kwargs):
        usecase = CreateRoadmapUseCase(repo=self.repository())
        data = request.data
        data['organization'] = request.organization.id
        data['created_by'] = request.user.id

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
        # serializer.is_valid(raise_exception=True)

        usecase = UpdateRoadmapUseCase(repo=self.repository())
        entity = usecase.execute(id=pk, data=serializer.initial_data, organization=request.organization, role=request.role) # type: ignore

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
        
    @action(detail=True, methods=["get"])
    def progress(self, request, *args, **kwargs):
        usecase = RoadmapProgressUseCase(repo=self.repository())
        response = usecase.execute(
            id=kwargs.get("pk"), # type: ignore
            organization=request.organization,
            role=request.role
        )
        return response

    @action(detail=False, methods=["get"])
    def stats(self, request, *args, **kwargs):
        usecase = RoadmapStatsUseCase(repo=self.repository())
        response = usecase.execute(
            id=kwargs.get("pk"), # type: ignore
            organization=request.organization,
            role=request.role
        )
        return response

        