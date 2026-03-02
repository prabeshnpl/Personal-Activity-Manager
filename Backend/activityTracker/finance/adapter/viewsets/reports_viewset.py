from finance.data.db.reports_impl import ReportsImpl
from utils.tenantViewsets import BaseTenantViewSet
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

class ReportView(BaseTenantViewSet):

    require_organization = True
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    repository = ReportsImpl
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        
        usecase = self.repository()
        response = usecase.get_reports(search_params=search_params, organization=request.organization, role=request.role)
        return response
    
    @action(methods=['GET'], detail=False, url_path="income-expense-trend")
    def income_expense_trend(self, request):
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        
        usecase = self.repository()
        response = usecase.get_income_expense_trend(search_params=search_params, organization=request.organization, role=request.role)
        return response

    @action(methods=['GET'], detail=False, url_path="detailed")
    def detailed(self, request):
        """Get a detailed report of transactions matching the filters."""
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user

        usecase = self.repository()
        response = usecase.get_detailed_reports(search_params=search_params, organization=request.organization, role=request.role)
        return response