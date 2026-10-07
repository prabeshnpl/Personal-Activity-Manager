from typing import List, Optional
from notification.domain.entity.notification_schedule_entity import NotificationScheduleEntity
from notification.domain.repository.notification_schedule_repo import NotificationScheduleRepository

class CreateNotificationScheduleUseCase:
    def __init__(self, repo: NotificationScheduleRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[NotificationScheduleEntity]:
        return self.repo.create_schedule(data=data)


class GetNotificationScheduleByIdUseCase:
    def __init__(self, repo: NotificationScheduleRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationScheduleEntity]:
        return self.repo.get_schedule_by_id(id=id)


class UpdateNotificationScheduleUseCase:
    def __init__(self, repo: NotificationScheduleRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> Optional[NotificationScheduleEntity]:
        return self.repo.update_schedule(id=id, data=data)


class DeleteNotificationScheduleUseCase:
    def __init__(self, repo: NotificationScheduleRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationScheduleEntity]:
        return self.repo.delete_schedule(id=id)


class ListNotificationSchedulesUseCase:
    def __init__(self, repo: NotificationScheduleRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[List[NotificationScheduleEntity]]:
        return self.repo.list_schedules(search_params=search_params)
    