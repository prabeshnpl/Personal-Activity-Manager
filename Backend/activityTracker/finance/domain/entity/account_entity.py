from typing import Optional
from datetime import datetime

class AccountEntity:
    def __init__(
        self,
        id: int,
        organization: ['Organization'], # type: ignore
        name: str,
        account_type: str,
        is_active: bool = True,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.name = name
        self.account_type = account_type
        self.is_active = is_active
        self.created_at = created_at

    def __str__(self):
        return self.name
