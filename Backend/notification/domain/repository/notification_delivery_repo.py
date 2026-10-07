from typing import Optional, List
from abc import ABC, abstractmethod
from notification.domain.entity.notification_delivery_entity import NotificationDeliveryEntity

class NotificationDeliveryRepository(ABC):

    @abstractmethod
    def create_delivery(self, data: dict) -> Optional[NotificationDeliveryEntity]:
        pass

    @abstractmethod
    def get_delivery_by_id(self, id: int) -> Optional[NotificationDeliveryEntity]:
        pass

    @abstractmethod
    def update_delivery(self, id: int, data: dict) -> Optional[NotificationDeliveryEntity]:
        pass

    @abstractmethod
    def delete_delivery(self, id: int) -> Optional[NotificationDeliveryEntity]:
        pass

    @abstractmethod
    def list_deliveries(self, search_params: dict) -> Optional[List[NotificationDeliveryEntity]]:
        pass
