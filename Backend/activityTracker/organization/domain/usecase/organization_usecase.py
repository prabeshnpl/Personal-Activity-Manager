from organization.domain.entity.organization_entity import OrganizationEntity
from organization.domain.repository.organization_repo import OrganizationRepository

class CreateOrganizationUseCase:
    def __init__(self, repo: OrganizationRepository):
        self.repo = repo

    def execute(self, data: dict) -> OrganizationEntity:
        return self.repo.create_organization(data=data)


class GetOrganizationByIdUseCase:
    def __init__(self, repo: OrganizationRepository):
        self.repo = repo

    def execute(self, id: int) -> OrganizationEntity:
        return self.repo.get_organization_by_id(id=id)


class UpdateOrganizationUseCase:
    def __init__(self, repo: OrganizationRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> OrganizationEntity:
        return self.repo.update_organization(id=id, data=data)


class DeleteOrganizationUseCase:
    def __init__(self, repo: OrganizationRepository):
        self.repo = repo

    def execute(self, id: int) -> OrganizationEntity:
        return self.repo.delete_organization(id=id)


class ListOrganizationsUseCase:
    def __init__(self, repo: OrganizationRepository):
        self.repo = repo

    def execute(self, search_params: dict):
        return self.repo.list_organizations(search_params=search_params)