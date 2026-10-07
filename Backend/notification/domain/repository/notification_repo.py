from typing import Optional, List
from abc import ABC, abstractmethod
from notification.domain.entity.notification_entity import NotificationEntity

class NotificationRepository(ABC):

    @abstractmethod
    def create_notification(self, data: dict) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def get_notification_by_id(self, id: int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def mark_as_read_notification(self, id:int, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def mark_all_as_read_notification(self,  user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def clear_read_notification(self, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def unread_notification_count(self, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def delete_notification(self, id:int, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def list_notifications(self, search_params: dict) -> Optional[List[NotificationEntity]]:
        pass

