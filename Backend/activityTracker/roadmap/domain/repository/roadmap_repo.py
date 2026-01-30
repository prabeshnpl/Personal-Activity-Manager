from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.roadmap_entity import RoadmapEntity

class RoadmapRepository(ABC):

    @abstractmethod
    def create_roadmap(self, data: dict) -> RoadmapEntity:
        pass

    @abstractmethod
    def get_roadmap_by_id(self, id: int) -> RoadmapEntity:
        pass

    @abstractmethod
    def update_roadmap(self, id: int, data: dict) -> RoadmapEntity:
        pass

    @abstractmethod
    def delete_roadmap(self, id: int) -> RoadmapEntity:
        pass

    @abstractmethod
    def list_roadmaps(self, search_params: dict) -> List[RoadmapEntity]:
        pass
