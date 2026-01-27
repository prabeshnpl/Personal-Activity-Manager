from typing import Optional
from datetime import datetime

class CategoryEntity:
    def __init__(
        self,
        id: int,
        organization: ['Organization'], # type: ignore
        name: str,
        category_type: str,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.name = name
        self.category_type = category_type
        self.created_at = created_at

    def __str__(self):
        return self.name

class CategoryBreakdownEntity(CategoryEntity):
    def __init__(
        self, 
        id: int, 
        organization: ['Organization'],  # type: ignore
        name: str, 
        category_type: str, 
        created_at: datetime | None = None,
        total:float = 0
    ):
        super().__init__(id, organization, name, category_type, created_at)
        self.total = total