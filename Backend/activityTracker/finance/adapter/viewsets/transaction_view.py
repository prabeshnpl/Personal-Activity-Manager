from rest_framework.permissions import IsAuthenticated
from finance.adapter.serializers.transaction_serializer import TransactionSerializer
from finance.data.db.transaction_impl import TransactionRepositoryImpl
from finance.domain.usecase.transaction_usecase import CreateTransactionUseCase, DeleteTransactionUseCase, GetTransactionByIdUseCase, ListTransactionsUseCase, UpdateTransactionUseCase
from utils.pagniator import CustomPageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.response import Response
from utils.tenantViewsets import BaseTenantModelViewSet

class TransactionViewset(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = TransactionRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    pagination_class = CustomPageNumberPagination

    require_organization = True

    def retrieve(self, request, pk:int):
        usecase = GetTransactionByIdUseCase(repo=self.repository())
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
        usecase = ListTransactionsUseCase(repo=self.repository())
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

        total_count = len(entities)

        page = self.paginate_queryset(entities)

        serializer = self.get_serializer(
            page, many=True,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )

        response = self.get_paginated_response(serializer.data)
        response.data['total_count'] = total_count
        return response
       
    def destroy(self, request, pk):
        usecase = DeleteTransactionUseCase(repo=self.repository())
        response = usecase.execute(id=pk, organization=request.organization,role=request.role)
        if isinstance(response, Response):
            return response
        return Response({'detail':"Deleted successfully"})
    
    def create(self, request, *args, **kwargs):
        usecase = CreateTransactionUseCase(repo=self.repository())
        data = request.data
        data['created_by']=request.user.id
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

        pk = kwargs.get("pk")
        partial = kwargs.get('partial')

        serializer = self.get_serializer(data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        usecase = UpdateTransactionUseCase(repo=self.repository())
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