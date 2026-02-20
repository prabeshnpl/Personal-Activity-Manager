from typing import List
from rest_framework.response import Response
from roadmap.models import Milestone
from django.db import transaction
from roadmap.domain.entity.milestone_entity import MilestoneEntity
from roadmap.domain.repository.milestone_repo import MilestoneRepository
from roadmap.models import Milestone

class MilestoneRepositoryImpl(MilestoneRepository):
    def list_milestones(self, search_params: dict, organization:int, role:str) -> List[MilestoneEntity] | Response:
        try:
            milestone = Milestone.objects.filter(roadmap__organization=organization)

            if roadmap:=search_params.get("roadmap"):
                milestone = milestone.filter(roadmap=roadmap)

            return [self.to_entity(milestone) for milestone in milestone]
        except Exception as e:
            print(f"Error occured in fetching milestone:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_milestone(self, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                milestone = Milestone.objects.create(**data)
                    
                return self.to_entity(milestone)
        except Exception as e:
            print(f"Error occured while creating milestone:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_milestone(self, id: int, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        try:
            milestone = Milestone.objects.filter(roadmap__organization=organization, id=id).first()
            if not milestone:
                return Response({'detail':'Invalid milestone'}, status=400)

            for key, value in data.items():
                if key in ['id', 'roadmap', 'created_at']:
                    continue
                elif key=='status':
                    if value not in ['pending', 'missed', 'completed']:
                        return Response({'detail':"Invalid type"}, status=400)
                setattr(milestone, key, value)
            
            milestone.save()

            return self.to_entity(milestone) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating milestone:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_milestone_by_id(self, id: int, organization:int, role:str) -> MilestoneEntity | Response:
        try:

            milestone = Milestone.objects.filter(roadmap__organization=organization, id=id).first()
            return self.to_entity(milestone) # type: ignore
        except Exception as e:
            print(f"Error occured while getting milestone:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_milestone(self, id: int, organization:int, role:str) -> Response:
        milestone = Milestone.objects.filter(roadmap__organization=organization, id=id).first()
        if milestone:
            milestone.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj: Milestone) -> MilestoneEntity:
        return MilestoneEntity(
            id=obj.id,  # type: ignore
            roadmap=obj.roadmap,
            title=obj.title,
            description=obj.description,
            status=obj.status,
            completed_at=obj.completed_at,
            start_date=obj.start_date,
            due_date=obj.due_date,
            created_at=obj.created_at,
        )