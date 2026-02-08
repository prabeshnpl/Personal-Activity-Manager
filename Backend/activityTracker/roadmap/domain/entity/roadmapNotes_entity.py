from typing import Optional
from datetime import date, datetime

class RoadmapNotesEntity:
    def __init__(
        self,
        id: int,
        roadmap: Optional['Roadmap'], # type: ignore
        title: str,
        content: str | None,
        hours_spent: float | None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.roadmap = roadmap
        self.hours_spent = hours_spent
        self.title = title
        self.content = content
        self.created_at = created_at

