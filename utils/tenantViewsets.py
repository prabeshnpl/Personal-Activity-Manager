from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ViewSet
from utils.mixins import TenantContextMixin

class BaseTenantModelViewSet(TenantContextMixin, ModelViewSet):
    """
    Base class for all tenant-aware ModelViewSets
    """
    pass

class BaseTenantViewSet(TenantContextMixin, ViewSet):
    """
    Base class for all tenant-aware ViewSets
    """
    pass

class BaseTenantAPIView(TenantContextMixin, APIView):
    """
    Base class for all tenant-aware APIViews
    """
    pass

