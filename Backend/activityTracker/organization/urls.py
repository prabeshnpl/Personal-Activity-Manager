from django.urls import include, path
from organization.adapter.viewsets.organization_viewset import OrganizationViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"organization", OrganizationViewset, basename='orgnaization')

urlpatterns = [
    path('', include(router.urls)),
]