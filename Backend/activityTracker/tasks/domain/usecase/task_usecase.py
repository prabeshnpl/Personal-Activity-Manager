from typing import List
from tasks.domain.entity.task_entity import TaskEntity
from tasks.domain.repository.task_repo import TaskRepository
from rest_framework.response import Response

class CreateTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> TaskEntity | Response:
        return self.repo.create_task(data=data, organization=organization, role=role)


class GetTaskByIdUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> TaskEntity | Response:
        return self.repo.get_task_by_id(id=id, organization=organization, role=role)


class UpdateTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> TaskEntity | Response:
        return self.repo.update_task(id=id, data=data, organization=organization, role=role)


class DeleteTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> TaskEntity | Response:
        return self.repo.delete_task(id=id, organization=organization, role=role)


class ListTasksUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[TaskEntity] | Response:
        return self.repo.list_tasks(search_params=search_params, organization=organization, role=role)