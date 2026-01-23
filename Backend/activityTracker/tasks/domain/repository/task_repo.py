from abc import ABC, abstractmethod
from tasks.domain.entity.task_entity import TaskEntity

class TaskRepository(ABC):

    @abstractmethod
    def create_task(self, data: dict) -> TaskEntity:
        pass

    @abstractmethod
    def get_task_by_id(self, id: int) -> TaskEntity:
        pass

    @abstractmethod
    def update_task(self, id: int, data: dict) -> TaskEntity:
        pass

    @abstractmethod
    def delete_task(self, id: int) -> TaskEntity:
        pass

    @abstractmethod
    def list_tasks(self, search_params: dict) -> list[TaskEntity]:
        pass