from django.urls import include, path
from rest_framework.routers import DefaultRouter
from user.adapter.viewsets.login_view import LoginView

router = DefaultRouter()
# router.register("", Viewset, basename="")

urlpatterns = [
    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login")
]
