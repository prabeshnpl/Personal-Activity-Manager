from typing import Optional
from datetime import datetime

class OrganizationEntity:
    def __init__(
        self,
        id: int,
        name: str,
        type: str,  # "personal", "family", or "business"
        created_by: int,  # store user id or a CustomUserEntity reference
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.name = name
        self.type = type
        self.created_by = created_by
        self.created_at = created_at
        self.updated_at = updated_at

    def __str__(self):
        return self.name