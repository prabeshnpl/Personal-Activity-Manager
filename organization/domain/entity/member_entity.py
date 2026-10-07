from typing import Any, Optional
from datetime import datetime

class MemberEntity:
    def __init__(
        self,
        id: int,
        organization: int,
        user: Any | None,
        role: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.user = user
        self.role = role
        self.created_at = created_at
        self.updated_at = updated_at

    def __str__(self):
        return f"Member-{self.id} ({self.role})"
    
class MemberBreakdownEntity(MemberEntity):
    def __init__(
            self, 
            id: int, 
            organization: int, 
            user: Any | None, 
            role: str, 
            created_at: datetime | None = None, 
            updated_at: datetime | None = None,
            total:float = 0
        ):
            super().__init__(id, organization, user, role, created_at, updated_at)
            self.total = total