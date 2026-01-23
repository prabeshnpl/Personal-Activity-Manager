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
    def update_notification(self, id: int, data: dict) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def delete_notification(self, id: int) -> Optional[NotificationEntity]:
        pass

    @abstractmethod
    def list_notifications(self, search_params: dict) -> Optional[List[NotificationEntity]]:
        pass

