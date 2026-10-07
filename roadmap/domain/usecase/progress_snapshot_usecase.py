from typing import List
from roadmap.domain.entity.progress_snapshot_entity import ProgressSnapshotEntity
from roadmap.domain.repository.progress_snapshot_repo import ProgressSnapshotRepository


class CreateProgressSnapshotUseCase:
    def __init__(self, repo: ProgressSnapshotRepository):
        self.repo = repo

    def execute(self, data: dict) -> ProgressSnapshotEntity:
        return self.repo.create_snapshot(data=data)


class GetProgressSnapshotByIdUseCase:
    def __init__(self, repo: ProgressSnapshotRepository):
        self.repo = repo

    def execute(self, id: int) -> ProgressSnapshotEntity:
        return self.repo.get_snapshot_by_id(id=id)


class UpdateProgressSnapshotUseCase:
    def __init__(self, repo: ProgressSnapshotRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> ProgressSnapshotEntity:
        return self.repo.update_snapshot(id=id, data=data)


class DeleteProgressSnapshotUseCase:
    def __init__(self, repo: ProgressSnapshotRepository):
        self.repo = repo

    def execute(self, id: int) -> ProgressSnapshotEntity:
        return self.repo.delete_snapshot(id=id)


class ListProgressSnapshotsUseCase:
    def __init__(self, repo: ProgressSnapshotRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> List[ProgressSnapshotEntity]:
        return self.repo.list_snapshots(search_params=search_params)