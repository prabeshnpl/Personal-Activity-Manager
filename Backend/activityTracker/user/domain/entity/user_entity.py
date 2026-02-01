from typing import Optional
from datetime import datetime

class CustomUserEntity:
    def __init__(
        self,
        id: int,
        email: str,
        username: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        contact_number: Optional[str] = None,
        profile_picture: Optional['FieldFile'] = None, # type: ignore
        is_deleted: Optional[bool] = False,
        is_disabled: Optional[bool] = False,
        is_active: Optional[bool] = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.email = email
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.contact_number = contact_number
        self.is_deleted = is_deleted
        self.is_disabled = is_disabled
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at
        self.profile_picture = profile_picture

    def __str__(self):
        return self.email or self.username or f"User-{self.id}"