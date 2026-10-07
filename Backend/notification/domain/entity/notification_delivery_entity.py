from typing import Optional
from datetime import datetime
class NotificationDeliveryEntity:
    def __init__(
        self,
        id: int,
        notification: int,
        channel: int,
        status: str = "pending",
        attempt_count: int = 0,
        last_attempt_at: Optional[datetime] = None,
        error_message: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.notification = notification
        self.channel = channel
        self.status = status
        self.attempt_count = attempt_count
        self.last_attempt_at = last_attempt_at
        self.error_message = error_message
        self.created_at = created_at

