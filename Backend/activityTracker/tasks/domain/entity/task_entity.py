from typing import Optional
from datetime import datetime

class TaskEntity:
    def __init__(
        self,
        id: int,
        organization: Optional['Organization'], # type: ignore
        created_by: Optional['CustomUser'] = None, # type: ignore
        assigned_to: Optional['CustomUser'] = None, # type: ignore
        title: str = "",
        description: Optional[str] = None,
        status: str = "pending",
        priority: str = "medium",
        due_at: Optional[datetime] = None,
        completed_at: Optional[datetime] = None,
        is_deleted: bool = False,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.created_by = created_by
        self.assigned_to = assigned_to
        self.title = title
        self.description = description
        self.status = status
        self.priority = priority
        self.due_at = due_at
        self.completed_at = completed_at
        self.is_deleted = is_deleted
        self.created_at = created_at
        self.updated_at = updated_at

    def __str__(self):
        return self.title