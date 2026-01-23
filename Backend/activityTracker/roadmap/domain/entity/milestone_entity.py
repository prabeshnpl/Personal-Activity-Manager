from typing import Optional
from datetime import date, datetime
class MilestoneEntity:
    def __init__(
        self,
        id: int,
        roadmap: int,
        title: str,
        start_date: Optional[date] = None,
        due_date: Optional[date] = None,
        completed_at: Optional[datetime] = None,
        linked_task: Optional[int] = None,
        status: str = "pending",
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.roadmap = roadmap
        self.title = title
        self.start_date = start_date
        self.due_date = due_date
        self.completed_at = completed_at
        self.linked_task = linked_task
        self.status = status
        self.created_at = created_at

    def __str__(self):
        return self.title
