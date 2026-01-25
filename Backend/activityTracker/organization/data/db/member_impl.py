from typing import List
from rest_framework.response import Response
from organization.domain.entity.member_entity import MemberEntity
from organization.domain.repository.member_repo import MemberRepository
from organization.models import Member

class MemberRepositoryImpl(MemberRepository):
    def list_members(self, search_params: dict) -> List[MemberEntity] | Response:
        try:
            organization=  search_params.get("organization")
            members = Member.objects.filter(organization=organization)

            if is_admin:=search_params.get("is_admin"):
                members.filter(role = 'admin' if is_admin=='true' else 'member')

            print("yes1")
            return [self.to_entity(member) for member in members]
        except Exception as e:
            print(f"Error occured in fetching members:{repr(e)}")
            return Response({'detail':f"{str(e)}"})
        
    def create_member(self, data: dict) -> MemberEntity | Response:
        return super().create_member(data)
    
    def update_member(self, id: int, data: dict) -> MemberEntity | Response:
        return super().update_member(id, data)
    
    def get_member_by_id(self, id: int) -> MemberEntity | Response:
        return super().get_member_by_id(id)
    
    def delete_member(self, id: int) -> MemberEntity | Response:
        return super().delete_member(id)
    
    def to_entity(self, obj:Member):
        return MemberEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            user=obj.user,
            role=obj.role,
            created_at=obj.created_at,
            updated_at=obj.updated_at
        )