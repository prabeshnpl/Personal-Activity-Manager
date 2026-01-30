from typing import Optional
from datetime import date, datetime

class ProgressSnapshotEntity:
    def __init__(
        self,
        id: int,
        roadmap: int,
        snapshot_date: date,
        expected_completion_percent: float,
        actual_completion_percent: float,
        delta_percent: float,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.roadmap = roadmap
        self.snapshot_date = snapshot_date
        self.expected_completion_percent = expected_completion_percent
        self.actual_completion_percent = actual_completion_percent
        self.delta_percent = delta_percent
        self.created_at = created_at

    def __str__(self):
        return f"Snapshot-{self.id} ({self.snapshot_date})"
