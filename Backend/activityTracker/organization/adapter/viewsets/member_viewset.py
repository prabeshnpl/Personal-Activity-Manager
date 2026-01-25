from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from organization.adapter.serializers.member_serializer import MemberSerializer
from organization.data.db.member_impl import MemberRepositoryImpl
from organization.domain.usecase.member_usecase import GetMemberByIdUseCase, ListMembersUseCase
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response

class MemberViewset(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = MemberRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = MemberSerializer
    pagination_class = CustomPageNumberPagination

    def retrieve(self, request, pk:int):
        usecase = GetMemberByIdUseCase(repo=self.repository())
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
        print(request.user)
        usecase = ListMembersUseCase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        # search_params['organization'] = request.organization
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