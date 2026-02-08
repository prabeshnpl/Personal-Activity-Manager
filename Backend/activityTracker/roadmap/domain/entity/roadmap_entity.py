from typing import Optional
from datetime import date, datetime

class RoadmapEntity:
    def __init__(
        self,
        id: int,
        organization: Optional['Organization'], # type: ignore
        title: str,
        type: str,
        category: str,
        target_hours:int | None,
        description: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        created_by: Optional['CustomUser'] = None, # type: ignore
        status: str = "active",
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.target_hours = target_hours
        self.category = category
        self.organization = organization
        self.type = type
        self.title = title
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.created_by = created_by
        self.status = status
        self.created_at = created_at

    def __str__(self):
        return self.title
