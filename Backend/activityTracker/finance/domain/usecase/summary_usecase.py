from finance.domain.repository.summary_repo import SummaryRepository
from finance.domain.entity.summary_entity import SummaryEntity
from rest_framework.response import Response

class GetSummaryUsecase:
    def __init__(self, repo:SummaryRepository) -> None:
        self.repo = repo

    def execute(self, search_params, organization, role) -> SummaryEntity | Response:
        return self.repo.get_summary(search_params=search_params, organization=organization, role=role)