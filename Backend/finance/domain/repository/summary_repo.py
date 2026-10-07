from abc import ABC, abstractmethod
from rest_framework.response import Response
from finance.domain.entity.summary_entity import SummaryEntity

class SummaryRepository(ABC):

    @abstractmethod
    def get_summary(self, search_params, organization, role) -> SummaryEntity | Response:
        pass