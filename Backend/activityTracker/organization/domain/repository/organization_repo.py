from abc import ABC, abstractmethod
from typing import List, Optional
from organization.domain.entity.organization_entity import OrganizationEntity
from rest_framework.response import Response

class OrganizationRepository(ABC):

    @abstractmethod
    def create_organization(self, data: dict) -> Optional[OrganizationEntity] | Response:
        pass

    @abstractmethod
    def get_organization_by_id(self, id: int) -> Optional[OrganizationEntity] | Response:
        pass

    @abstractmethod
    def update_organization(self, id: int, data: dict) -> Optional[OrganizationEntity] | Response:
        pass

    @abstractmethod
    def delete_organization(self, id: int) -> Optional[OrganizationEntity] | Response:
        pass

    @abstractmethod
    def list_organizations(self, search_params: dict) -> Optional[List[OrganizationEntity]] | Response:
        pass
