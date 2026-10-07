from django.urls import include, path
from rest_framework.routers import DefaultRouter
from roadmap.adapter.views.milestone_view import MilestoneView
from roadmap.adapter.views.roadmapNotes_view import RoadmapNotesView
from roadmap.adapter.views.roadmap_view import RoadmapView

router = DefaultRouter()
router.register("roadmaps", RoadmapView, basename="tasks")
router.register("milestone", MilestoneView, basename="milestone")
router.register("roadmap-notes", RoadmapNotesView, basename="roadmaps-notes")

urlpatterns = [
    path('', include(router.urls)),
]
