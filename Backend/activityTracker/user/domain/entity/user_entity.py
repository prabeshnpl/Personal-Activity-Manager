from typing import Optional
from datetime import datetime

class CustomUserEntity:
    def __init__(
        self,
        id: int,
        email: str,
        username: Optional[str] = None,
        password: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        contact_number: Optional[str] = None,
        google_id: Optional[str] = None,
        apple_id: Optional[str] = None,
        is_deleted: Optional[bool] = False,
        is_disabled: Optional[bool] = False,
        is_active: Optional[bool] = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        is_superuser: Optional[bool] = None,
        is_staff: Optional[bool] = None,
    ):
        self.id = id
        self.email = email
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.contact_number = contact_number
        self.google_id = google_id
        self.apple_id = apple_id
        self.is_deleted = is_deleted
        self.is_disabled = is_disabled
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at
        self.is_superuser = is_superuser
        self.is_staff = is_staff

    def __str__(self):
        return self.email or self.username or f"User-{self.id}"