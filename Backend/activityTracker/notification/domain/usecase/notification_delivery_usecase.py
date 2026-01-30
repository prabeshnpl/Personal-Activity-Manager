from typing import Optional, List
from notification.domain.entity.notification_delivery_entity import NotificationDeliveryEntity
from notification.domain.repository.notification_delivery_repo import NotificationDeliveryRepository

class CreateNotificationDeliveryUseCase:
    def __init__(self, repo: NotificationDeliveryRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[NotificationDeliveryEntity]:
        return self.repo.create_delivery(data=data)


class GetNotificationDeliveryByIdUseCase:
    def __init__(self, repo: NotificationDeliveryRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationDeliveryEntity]:
        return self.repo.get_delivery_by_id(id=id)


class UpdateNotificationDeliveryUseCase:
    def __init__(self, repo: NotificationDeliveryRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> Optional[NotificationDeliveryEntity]:
        return self.repo.update_delivery(id=id, data=data)


class DeleteNotificationDeliveryUseCase:
    def __init__(self, repo: NotificationDeliveryRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationDeliveryEntity]:
        return self.repo.delete_delivery(id=id)


class ListNotificationDeliveriesUseCase:
    def __init__(self, repo: NotificationDeliveryRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[List[NotificationDeliveryEntity]]:
        return self.repo.list_deliveries(search_params=search_params)
