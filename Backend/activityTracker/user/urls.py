from django.urls import include, path
from rest_framework.routers import DefaultRouter
from user.adapter.viewsets.login_view import LoginView
from user.adapter.viewsets.user_view import CreateUserView

router = DefaultRouter()
# router.register("user", CustomUserView, basename="user")

urlpatterns = [
    path('', include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", CreateUserView.as_view(), name="register")
]
