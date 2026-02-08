from typing import List
from rest_framework.response import Response
from roadmap.models import Roadmap
from django.db import transaction
from roadmap.domain.entity.roadmap_entity import RoadmapEntity
from roadmap.domain.repository.roadmap_repo import RoadmapRepository
from roadmap.models import Roadmap
from django.db.models import Q

class RoadmapRepositoryImpl(RoadmapRepository):
    def list_roadmaps(self, search_params: dict, organization:int, role:str) -> List[RoadmapEntity] | Response:
        try:
            roadmap = Roadmap.objects.filter(organization=organization)

            if status:=search_params.get("status"):
                roadmap = roadmap.filter(status=status)

            if search:=search_params.get("search"):
                roadmap = roadmap.filter(
                    Q(description__icontains = search)
                    | Q(title__icontains = search)
                    | Q(status__icontains = search)
                    | Q(created_by__email__icontains = search)
                )

            return [self.to_entity(roadmap) for roadmap in roadmap]
        except Exception as e:
            print(f"Error occured in fetching roadmap:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_roadmap(self, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                roadmap = Roadmap.objects.create(**data)
                    
                return self.to_entity(roadmap)
        except Exception as e:
            print(f"Error occured while creating roadmap:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)

    def update_roadmap(self, id: int, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            print(data)
            roadmap = Roadmap.objects.filter(organization=organization, id=id).first()
            if not roadmap:
                return Response({'detail':'Invalid roadmap'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                setattr(roadmap, key, value)
            
            roadmap.save()

            return self.to_entity(roadmap) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating roadmap:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_roadmap_by_id(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            roadmap = Roadmap.objects.filter(organization=organization, id=id).first()
            return self.to_entity(roadmap) # type: ignore
        except Exception as e:
            print(f"Error occured while getting roadmap:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_roadmap(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        roadmap = Roadmap.objects.filter(organization=organization, id=id).first()
        if roadmap:
            roadmap.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj: Roadmap) -> RoadmapEntity:
        return RoadmapEntity(
            id=obj.id,  # type: ignore
            organization=obj.organization,
            category=obj.category,
            type=obj.type,
            target_hours=obj.target_hours,
            created_by=obj.created_by,
            title=obj.title,
            description=obj.description,
            status=obj.status,
            created_at=obj.created_at,
            start_date=obj.start_date,
            end_date=obj.start_date
        )