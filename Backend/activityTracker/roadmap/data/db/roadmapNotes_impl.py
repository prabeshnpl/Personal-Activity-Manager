from typing import List
from rest_framework.response import Response
import roadmap
from roadmap.domain.entity.roadmapNotes_entity import RoadmapNotesEntity
from roadmap.domain.repository.roadmapNotes_repo import RoadmapNotesRepository
from roadmap.models import RoadmapNotes
from django.db import transaction
from django.db.models import Q

class RoadmapNotesRepositoryImpl(RoadmapNotesRepository):
    def list_roadmaps_notes(self, search_params: dict, organization:int, role:str) -> List[RoadmapNotesEntity] | Response:
        try:
            roadmap_notes = RoadmapNotes.objects.filter(roadmap__organization=organization)

            if search:=search_params.get("search"):
                roadmap_notes = roadmap_notes.filter(
                    Q(content__icontains = search)
                    | Q(title__icontains = search)
                )
            if roadmap:=search_params.get("roadmap"):
                roadmap_notes = roadmap_notes.filter(roadmap=roadmap)
            
            return [self.to_entity(roadmap_notes) for roadmap_notes in roadmap_notes]
        except Exception as e:
            print(f"Error occured in fetching roadmap_notes:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_roadmap_notes(self, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                roadmap = data.get('roadmap')
                if not roadmap.organization == organization: # type: ignore
                    return Response({'detail':"Not authorized"}, status=400)
                roadmap_notes = RoadmapNotes.objects.create(**data)
                    
                return self.to_entity(roadmap_notes)
        except Exception as e:
            print(f"Error occured while creating roadmap_notes:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)

    def update_roadmap_notes(self, id: int, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        try:
            roadmap_notes = RoadmapNotes.objects.filter(roadmap__organization=organization, id=id).first()
            if not roadmap_notes:
                return Response({'detail':'Invalid roadmap_notes'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                setattr(roadmap_notes, key, value)
            
            roadmap_notes.save()

            return self.to_entity(roadmap_notes) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating roadmap_notes:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_roadmap_notes_by_id(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        try:
            roadmap_notes = RoadmapNotes.objects.filter(roadmap__organization=organization, id=id).first()
            return self.to_entity(roadmap_notes) # type: ignore
        except Exception as e:
            print(f"Error occured while getting roadmap_notes:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_roadmap_notes(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        roadmap_notes = RoadmapNotes.objects.filter(roadmap__organization=organization, id=id).first()
        if roadmap_notes:
            roadmap_notes.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj: RoadmapNotes) -> RoadmapNotesEntity:
        return RoadmapNotesEntity(
            id=obj.id,  # type: ignore
            title=obj.title,
            content=obj.content,
            roadmap=obj.roadmap,
            hours_spent=obj.hours_spent,
            created_at=obj.created_at,
        )