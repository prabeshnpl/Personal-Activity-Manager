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
        try:
            if data.get('member_type') not in ['cash', 'bank', 'digital']:
                return Response({'detail':"Invalid member_type"}, status=400)
            member = Member.objects.create(**data)
            
            return self.to_entity(member)
        except Exception as e:
            print(f"Error occured while creating member:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_member(self, id: int, data: dict, organization:int, role:str) -> MemberEntity | Response:
        try:
            member = Member.objects.filter(organization=organization, id=id).first()
            if not member:
                return Response({'detail':'Invalid member'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                elif key=='member_type':
                    if value not in ['cash', 'bank', 'digital']:
                        return Response({'detail':"Invalid member_type"}, status=400)
                setattr(member, key, value)
                
            return self.to_entity(member) # type: ignore
        except Exception as e:
            print(f"Error occured while updating member:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
        
    def get_member_by_id(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        try:
            member = Member.objects.filter(organization=organization, id=id).first()
            return self.to_entity(member) # type: ignore
        except Exception as e:
            print(f"Error occured while creating member:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_member(self, id: int, organization:int, role:str) -> Response:
        member = Member.objects.filter(organization=organization, id=id).first()
        if member:
            member.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
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