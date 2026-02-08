from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.roadmapNotes_entity import RoadmapNotesEntity
from rest_framework.response import Response

class RoadmapNotesRepository(ABC):

    @abstractmethod
    def create_roadmap_notes(self, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        pass

    @abstractmethod
    def get_roadmap_notes_by_id(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        pass

    @abstractmethod
    def update_roadmap_notes(self, id: int, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        pass

    @abstractmethod
    def delete_roadmap_notes(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        pass

    @abstractmethod
    def list_roadmaps_notes(self, search_params: dict, organization:int, role:str) -> List[RoadmapNotesEntity] | Response:
        pass

