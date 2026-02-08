from django.urls import include, path
from rest_framework.routers import DefaultRouter
from roadmap.adapter.views.roadmap_view import RoadmapView

router = DefaultRouter()
router.register("roadmaps", RoadmapView, basename="tasks")

urlpatterns = [
    path('', include(router.urls)),
]
