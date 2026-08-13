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

    def execute(self, data: dict) -> Optional[tuple[dict,int]]:
        return self.repo.mark_as_read_notification(
            id=data.get("id"),
            user_id=data.get('user_id'), 
            organization_id=data.get('organization_id')
        )


class MarkAllAsReadNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[tuple[dict,int]]:
        return self.repo.mark_all_as_read_notification(
            user_id=data.get('user_id'), 
            organization_id=data.get('organization_id')
        )

class ClearReadNotificationUsecase:
    def __init__(self, repo: NotificationRepository):
            self.repo = repo
    
    def execute(self, data: dict) -> Optional[tuple[dict, int]]:
        return self.repo.clear_read_notification(
            id=data.get("id"),
            user_id=data.get('user_id'), 
            organization_id=data.get('organization_id')
        )

class UnreadCountNotificationUsecase:
    def __init__(self, repo: NotificationRepository):
            self.repo = repo
    
    def execute(self, data: dict) -> Optional[tuple[dict, int]]:
        return self.repo.unread_notification_count(
            user_id=data.get('user_id'), 
            organization_id=data.get('organization_id')
        )

class DeleteNotificationUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[tuple[dict, int]]:
        return self.repo.delete_notification(
            id=data.get("id"),
            user_id=data.get('user_id'), 
            organization_id=data.get('organization_id')
        )


class ListNotificationsUseCase:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[tuple[List[NotificationEntity], int]]:
        return self.repo.list_notifications(search_params=search_params)

