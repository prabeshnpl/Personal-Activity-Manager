class NotificationChannelEntity:
    def __init__(
        self,
        id: int,
        name: str,
        is_active: bool = True,
    ):
        self.id = id
        self.name = name
        self.is_active = is_active

    def __str__(self):
        return self.name
