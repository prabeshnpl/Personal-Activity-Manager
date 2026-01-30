from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.milestone_entity import MilestoneEntity

class MilestoneRepository(ABC):

    @abstractmethod
    def create_milestone(self, data: dict) -> MilestoneEntity:
        pass

    @abstractmethod
    def get_milestone_by_id(self, id: int) -> MilestoneEntity:
        pass

    @abstractmethod
    def update_milestone(self, id: int, data: dict) -> MilestoneEntity:
        pass

    @abstractmethod
    def delete_milestone(self, id: int) -> MilestoneEntity:
        pass

    @abstractmethod
    def list_milestones(self, search_params: dict) -> List[MilestoneEntity]:
        pass
