from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.roadmap_entity import RoadmapEntity
from rest_framework.response import Response

class RoadmapRepository(ABC):

    @abstractmethod
    def create_roadmap(self, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        pass

    @abstractmethod
    def get_roadmap_by_id(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        pass

    @abstractmethod
    def update_roadmap(self, id: int, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        pass

    @abstractmethod
    def delete_roadmap(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        pass

    @abstractmethod
    def list_roadmaps(self, search_params: dict, organization:int, role:str) -> List[RoadmapEntity] | Response:
        pass

    @abstractmethod
    def roadmap_progress(self, id:int, organization:int, role:str) -> Response:
        pass

    @abstractmethod
    def roadmap_stats(self, id:int, organization:int, role:str) -> Response:
        pass
