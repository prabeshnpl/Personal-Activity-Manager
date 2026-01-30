from typing import Optional, List
from notification.domain.entity.notification_entity import NotificationEntity
from notification.domain.repository.notification_repo import NotificationRepository

class CreateNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[NotificationEntity]:
        return self.repo.create_notification(data=data)


class GetNotificationByIdUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationEntity]:
        return self.repo.get_notification_by_id(id=id)


class UpdateNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> Optional[NotificationEntity]:
        return self.repo.update_notification(id=id, data=data)


class DeleteNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationEntity]:
        return self.repo.delete_notification(id=id)


class ListNotificationsUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[List[NotificationEntity]]:
        return self.repo.list_notifications(search_params=search_params)

