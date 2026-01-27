from typing import List
from rest_framework.response import Response
from organization.domain.entity.member_entity import MemberBreakdownEntity, MemberEntity
from organization.domain.repository.member_repo import MemberRepository
from organization.models import Member
from django.db.models import Sum

class MemberRepositoryImpl(MemberRepository):
    def list_members(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        try:
            members = Member.objects.filter(organization=organization)

            if is_admin:=search_params.get("is_admin"):
                members.filter(role = 'admin' if is_admin=='true' else 'member')

            return [self.to_entity(member) for member in members]
        except Exception as e:
            print(f"Error occured in fetching members:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def breakdown_members(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        try:
            members = Member.objects.filter(organization=organization)
            members = members.annotate(
                total = Sum('user__transactions')
            )

            if is_admin:=search_params.get("is_admin"):
                members.filter(role = 'admin' if is_admin=='true' else 'member')

            return [self.to_breakdown_entity(member) for member in members]
        except Exception as e:
            print(f"Error occured in fetching members:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
        
    def create_member(self, data: dict, organization:int, role:str) -> MemberEntity | Response:
        return super().create_member(data, organization, role)
    
    def update_member(self, id: int, data: dict, organization:int, role:str) -> MemberEntity | Response:
        return super().update_member(id, data,organization, role)
    
    def get_member_by_id(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        return super().get_member_by_id(id, organization, role)
    
    def delete_member(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        return super().delete_member(id, organization, role)
    
    def to_entity(self, obj:Member):
        return MemberEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            user=obj.user,
            role=obj.role,
            created_at=obj.created_at,
            updated_at=obj.updated_at
        )
    def to_breakdown_entity(self, obj:Member):
        return MemberBreakdownEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            user=obj.user,
            role=obj.role,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
            total=obj.total # type: ignore
        )