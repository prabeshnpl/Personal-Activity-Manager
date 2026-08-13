from typing import Optional
from datetime import datetime

class NotificationEntity:
    def __init__(
        self,
        id: int,
        organization: int,
        recipient: int,
        notification_type: str,
        title: str,
        message: str,
        source_type: str,
        source_id: int,
        is_read: bool,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.recipient = recipient
        self.notification_type = notification_type
        self.title = title
        self.message = message
        self.source_type = source_type
        self.source_id = source_id
        self.created_at = created_at
        self.is_read = is_read

    def __str__(self):
        return self.title
