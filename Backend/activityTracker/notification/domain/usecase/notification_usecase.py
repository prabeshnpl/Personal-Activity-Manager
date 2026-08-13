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


class MarkAsReadNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[tuple[str,int]]:
        return self.repo.mark_as_read_notification(id=data.id, user_id=data.user_id, organization=data.organization)

class MarkAllAsReadNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> Optional[tuple[str,int]]:
        return self.repo.mark_all_as_read_notification(user_id=data.user_id, organization=data.organization)


class DeleteNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[tuple[str, int]]:
        return self.repo.delete_notification(id=id)


class ListNotificationsUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[tuple[List[NotificationEntity], int]]:
        return self.repo.list_notifications(search_params=search_params)

