from abc import ABC, abstractmethod
from typing import List
from tasks.domain.entity.task_entity import TaskEntity
from rest_framework.response import Response

class TaskRepository(ABC):

    @abstractmethod
    def create_task(self, data: dict, organization:int, role:str) -> TaskEntity | Response:
        pass

    @abstractmethod
    def get_task_by_id(self, id: int, organization:int, role:str) -> TaskEntity | Response:
        pass

    @abstractmethod
    def update_task(self, id: int, data: dict, organization:int, role:str) -> TaskEntity | Response:
        pass

    @abstractmethod
    def delete_task(self, id: int, organization:int, role:str) -> TaskEntity | Response:
        pass

    @abstractmethod
    def list_tasks(self, search_params: dict, organization:int, role:str) -> List[TaskEntity] | Response:
        pass