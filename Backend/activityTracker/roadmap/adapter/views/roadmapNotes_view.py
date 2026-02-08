from rest_framework.permissions import IsAuthenticated
from roadmap.adapter.serializers.roadmapNotes_serializer import RoadmapNotesSerializer
from roadmap.data.db.roadmapNotes_impl import RoadmapNotesRepositoryImpl
from roadmap.domain.usecase.roadmapNotes_usecase import (
    CreateRoadmapNotesUseCase, DeleteRoadmapNotesUseCase, 
    GetRoadmapNotesByIdUseCase, UpdateRoadmapNotesUseCase, 
    ListRoadmapsNotesUseCase
)
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from utils.tenantViewsets import BaseTenantModelViewSet

class RoadmapNotesView(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = RoadmapNotesRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = RoadmapNotesSerializer
    pagination_class = CustomPageNumberPagination

    require_organization = True

    def retrieve(self, request, pk:int):
        usecase = GetRoadmapNotesByIdUseCase(repo=self.repository())
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
        usecase = ListRoadmapsNotesUseCase(repo=self.repository())
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
        usecase = DeleteRoadmapNotesUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
        if isinstance(response, Response):
            return response
        return Response({'detail':"Deleted successfully"})
    
    def create(self, request, *args, **kwargs):
        usecase = CreateRoadmapNotesUseCase(repo=self.repository())
        data = request.data

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

        usecase = UpdateRoadmapNotesUseCase(repo=self.repository())
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
    