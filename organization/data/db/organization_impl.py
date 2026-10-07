from typing import List, Optional
from organization.domain.entity.organization_entity import OrganizationEntity
from organization.domain.repository.organization_repo import OrganizationRepository
from rest_framework.response import Response

from organization.models import Organization

class OrganizationRepositoryImpl(OrganizationRepository):
    def create_organization(self, data: dict) -> Optional[OrganizationEntity] | Response:
        return super().create_organization(data)
    
    def delete_organization(self, id: int) -> Optional[OrganizationEntity] | Response:
        return super().delete_organization(id)
    
    def update_organization(self, id: int, data: dict) -> Optional[OrganizationEntity] | Response:
        return super().update_organization(id, data)
    
    def get_organization_by_id(self, id: int) -> Optional[OrganizationEntity] | Response:
        organization = Organization.objects.filter(id=id).first()
        if not organization:
            return Response({'detail':"No organization found."}, status=400)
        return self.to_entity(organization)
    
    def list_organizations(self, search_params: dict) -> Optional[List[OrganizationEntity]] | Response:
        try:
            user = search_params.get("user")
            organizations = Organization.objects.filter(members__user = user)

            if is_owner:=search_params.get("is_owner"):
                organizations.filter(is_owner= True if is_owner=='true' else False)

            return [self.to_entity(organization) for organization in organizations]
        except Exception as e:
            print(f"Error while listing organizations:{repr(e)}")
            return Response({"detail":f"{str(e)}"}, status=400)
        
    def to_entity(self, organization:Organization)->OrganizationEntity:
        return OrganizationEntity(
            id=organization.id, # type: ignore
            name=organization.name,
            type=organization.type,
            created_by=organization.created_by,
            created_at=organization.created_at,
            updated_at=organization.updated_at
        )