from typing import Optional, List
from notification.domain.entity.notification_channel_entity import NotificationChannelEntity
from notification.domain.repository.notification_channel_repo import NotificationChannelRepository

class CreateNotificationChannelUseCase:
    def __init__(self, repo: NotificationChannelRepository):
        self.repo = repo

    def execute(self, data: dict) -> Optional[NotificationChannelEntity]:
        return self.repo.create_channel(data=data)


class GetNotificationChannelByIdUseCase:
    def __init__(self, repo: NotificationChannelRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationChannelEntity]:
        return self.repo.get_channel_by_id(id=id)


class UpdateNotificationChannelUseCase:
    def __init__(self, repo: NotificationChannelRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> Optional[NotificationChannelEntity]:
        return self.repo.update_channel(id=id, data=data)


class DeleteNotificationChannelUseCase:
    def __init__(self, repo: NotificationChannelRepository):
        self.repo = repo

    def execute(self, id: int) -> Optional[NotificationChannelEntity]:
        return self.repo.delete_channel(id=id)


class ListNotificationChannelsUseCase:
    def __init__(self, repo: NotificationChannelRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> Optional[List[NotificationChannelEntity]]:
        return self.repo.list_channels(search_params=search_params)

