from typing import Optional, List
from abc import ABC, abstractmethod
from notification.domain.entity.notification_schedule_entity import NotificationScheduleEntity

class NotificationScheduleRepository(ABC):

    @abstractmethod
    def create_schedule(self, data: dict) -> Optional[NotificationScheduleEntity]:
        pass

    @abstractmethod
    def get_schedule_by_id(self, id: int) -> Optional[NotificationScheduleEntity]:
        pass

    @abstractmethod
    def update_schedule(self, id: int, data: dict) -> Optional[NotificationScheduleEntity]:
        pass

    @abstractmethod
    def delete_schedule(self, id: int) -> Optional[NotificationScheduleEntity]:
        pass

    @abstractmethod
    def list_schedules(self, search_params: dict) -> Optional[List[NotificationScheduleEntity]]:
        pass

