from abc import ABC, abstractmethod
from typing import List
from organization.domain.entity.organization_entity import OrganizationEntity

class OrganizationRepository(ABC):

    @abstractmethod
    def create_organization(self, data: dict) -> OrganizationEntity:
        pass

    @abstractmethod
    def get_organization_by_id(self, id: int) -> OrganizationEntity:
        pass

    @abstractmethod
    def update_organization(self, id: int, data: dict) -> OrganizationEntity:
        pass

    @abstractmethod
    def delete_organization(self, id: int) -> OrganizationEntity:
        pass

    @abstractmethod
    def list_organizations(self, search_params: dict) -> List[OrganizationEntity]:
        pass
