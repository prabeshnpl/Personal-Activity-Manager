from typing import Optional
from datetime import datetime

class NotificationScheduleEntity:
    def __init__(
        self,
        id: int,
        notification: int,
        scheduled_at: datetime,
        is_processed: bool = False,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.notification = notification
        self.scheduled_at = scheduled_at
        self.is_processed = is_processed
        self.created_at = created_at

