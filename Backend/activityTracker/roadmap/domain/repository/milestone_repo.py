from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.milestone_entity import MilestoneEntity
from rest_framework.response import Response

class MilestoneRepository(ABC):

    @abstractmethod
    def create_milestone(self, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        pass

    @abstractmethod
    def get_milestone_by_id(self, id: int, organization:int, role:str) -> MilestoneEntity | Response:
        pass

    @abstractmethod
    def update_milestone(self, id: int, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        pass

    @abstractmethod
    def delete_milestone(self, id: int, organization:int, role:str) -> MilestoneEntity | Response:
        pass

    @abstractmethod
    def list_milestones(self, search_params: dict, organization:int, role:str) -> List[MilestoneEntity] | Response:
        pass
