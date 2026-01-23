from tasks.domain.entity.task_entity import TaskEntity
from tasks.domain.repository.task_repo import TaskRepository


class CreateTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, data: dict) -> TaskEntity:
        return self.repo.create_task(data=data)


class GetTaskByIdUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int) -> TaskEntity:
        return self.repo.get_task_by_id(id=id)


class UpdateTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> TaskEntity:
        return self.repo.update_task(id=id, data=data)


class DeleteTaskUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, id: int) -> TaskEntity:
        return self.repo.delete_task(id=id)


class ListTasksUseCase:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> list[TaskEntity]:
        return self.repo.list_tasks(search_params=search_params)