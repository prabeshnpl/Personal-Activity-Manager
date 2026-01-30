from typing import Optional
from datetime import date, datetime

class RoadmapEntity:
    def __init__(
        self,
        id: int,
        organization: int,
        title: str,
        description: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        created_by: Optional[int] = None,
        status: str = "active",
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.title = title
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.created_by = created_by
        self.status = status
        self.created_at = created_at

    def __str__(self):
        return self.title
