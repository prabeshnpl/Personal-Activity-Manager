from django.urls import include, path
from rest_framework.routers import DefaultRouter
from tasks.adapter.viewsets.task_view import TaskView

router = DefaultRouter()
router.register("tasks", TaskView, basename="tasks")

urlpatterns = [
    path('', include(router.urls)),
]
