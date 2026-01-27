from finance.adapter.serializers.summary_entity_serializer import SummarySerializer
from finance.data.db.summary_impl import SummaryRepositoryImpl
from finance.domain.usecase.summary_usecase import GetSummaryUsecase
from utils.tenantViewsets import BaseTenantViewSet
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class SummaryView(BaseTenantViewSet):

    require_organization = True
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = SummaryRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = SummarySerializer

    def list(self, request, *args, **kwargs):

        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        usecase = GetSummaryUsecase(repo=self.repository())
        entity = usecase.execute(
            search_params=search_params, 
            organization=request.organization, 
            role=request.role
        )
        if isinstance(entity, Response):
            return entity

        # print(entity.income)
        serializer = self.serializer_class(entity)

        return Response(serializer.data)
