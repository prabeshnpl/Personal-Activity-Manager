from typing import List
from abc import ABC, abstractmethod
from roadmap.domain.entity.progress_snapshot_entity import ProgressSnapshotEntity

class ProgressSnapshotRepository(ABC):

    @abstractmethod
    def create_snapshot(self, data: dict) -> ProgressSnapshotEntity:
        pass

    @abstractmethod
    def get_snapshot_by_id(self, id: int) -> ProgressSnapshotEntity:
        pass

    @abstractmethod
    def update_snapshot(self, id: int, data: dict) -> ProgressSnapshotEntity:
        pass

    @abstractmethod
    def delete_snapshot(self, id: int) -> ProgressSnapshotEntity:
        pass

    @abstractmethod
    def list_snapshots(self, search_params: dict) -> List[ProgressSnapshotEntity]:
        pass
