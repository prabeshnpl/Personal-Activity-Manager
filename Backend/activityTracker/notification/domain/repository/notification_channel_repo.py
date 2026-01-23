from typing import Optional, List
from abc import ABC, abstractmethod
from notification.domain.entity.notification_channel_entity import NotificationChannelEntity

class NotificationChannelRepository(ABC):

    @abstractmethod
    def create_channel(self, data: dict) -> Optional[NotificationChannelEntity]:
        pass

    @abstractmethod
    def get_channel_by_id(self, id: int) -> Optional[NotificationChannelEntity]:
        pass

    @abstractmethod
    def update_channel(self, id: int, data: dict) -> Optional[NotificationChannelEntity]:
        pass

    @abstractmethod
    def delete_channel(self, id: int) -> Optional[NotificationChannelEntity]:
        pass

    @abstractmethod
    def list_channels(self, search_params: dict) -> Optional[List[NotificationChannelEntity]]:
        pass

