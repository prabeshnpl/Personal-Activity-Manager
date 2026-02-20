from typing import List
from rest_framework.response import Response
from roadmap.models import Roadmap
from django.db import transaction
from roadmap.domain.entity.roadmap_entity import RoadmapEntity
from roadmap.domain.repository.roadmap_repo import RoadmapRepository
from roadmap.models import Roadmap
from django.db.models import Q
from django.utils import timezone
from django.db.models import Sum, Count, Q, Value, IntegerField
from django.db.models.functions import Coalesce

from rest_framework.response import Response

class RoadmapRepositoryImpl(RoadmapRepository):
    def list_roadmaps(self, search_params: dict, organization:int, role:str) -> List[RoadmapEntity] | Response:
        try:
            roadmap = Roadmap.objects.\
                annotate(
                    completed_hours=Coalesce(Sum('notes__hours_spent'), Value(0), output_field=IntegerField()),
                    milestones_count=Count('milestones', distinct=True),
                    completed_milestones_count=Count('milestones', filter=Q(milestones__status='completed'), distinct=True)
                ).\
                filter(organization=organization).\
                order_by('-created_at')

            if status:=search_params.get("status"):
                roadmap = roadmap.filter(status=status)

            if search:=search_params.get("search"):
                roadmap = roadmap.filter(
                    Q(description__icontains = search)
                    | Q(title__icontains = search)
                    | Q(status__icontains = search)
                    | Q(created_by__email__icontains = search)
                )
            if type:=search_params.get("type"):
                roadmap = roadmap.filter(type=type)

            if category:=search_params.get("category"):
                roadmap = roadmap.filter(category=category)

            if start_date:=search_params.get("start_date"):
                roadmap = roadmap.filter(start_date=start_date)

            if end_date:=search_params.get("end_date"):
                roadmap = roadmap.filter(end_date=end_date)
            
            return [self.to_entity(roadmap) for roadmap in roadmap]
        except Exception as e:
            print(f"Error occured in fetching roadmap:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_roadmap(self, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                roadmap = Roadmap.objects.create(**data)
                # Refresh from database with annotations
                roadmap = Roadmap.objects.filter(id=roadmap.id).annotate( # type: ignore
                    completed_hours=Sum('notes__hours_spent'),
                    milestones_count=Count('milestones'),
                    completed_milestones_count=Count('milestones', filter=Q(milestones__status='completed'))
                ).first()
                    
                return self.to_entity(roadmap) # type: ignore
        except Exception as e:
            print(f"Error occured while creating roadmap:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)

    def update_roadmap(self, id: int, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            roadmap = Roadmap.objects.filter(organization=organization, id=id).first()
            if not roadmap:
                return Response({'detail':'Invalid roadmap'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                setattr(roadmap, key, value)
            
            roadmap.save()

            # Refresh with annotations
            roadmap = Roadmap.objects.filter(organization=organization, id=id).annotate(
                completed_hours=Sum('notes__hours_spent'),
                milestones_count=Count('milestones'),
                completed_milestones_count=Count('milestones', filter=Q(milestones__status='completed'))
            ).first()

            return self.to_entity(roadmap) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating roadmap:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_roadmap_by_id(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        try:
            roadmap = Roadmap.objects.filter(organization=organization, id=id).annotate(
                completed_hours=Sum('notes__hours_spent'),
                milestones_count=Count('milestones'),
                completed_milestones_count=Count('milestones', filter=Q(milestones__status='completed'))
            ).first()
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
    
    def roadmap_progress(self, id:int, organization:int, role:str):
        try:
            roadmap = Roadmap.objects.filter(organization=organization, id=id).first()
            if not roadmap:
                return Response({'detail':'Invalid roadmap'}, status=400)

            # Milestones
            milestones_total = roadmap.milestones.count() # type: ignore
            milestones_completed = roadmap.milestones.filter(status='completed').count() # type: ignore

            # Hours logged from notes
            hours_logged = roadmap.notes.aggregate(total=Sum('hours_spent')).get('total') or 0 # type: ignore

            target_hours = roadmap.target_hours or 0

            # Progress percentage (prefer hours if target provided, else milestone completion percent)
            if target_hours and target_hours > 0:
                progress_percentage = round(min((hours_logged / target_hours) * 100, 100))
            else:
                progress_percentage = round((milestones_completed / milestones_total) * 100) if milestones_total else 0

            # Dates and timeline
            today = timezone.now().date()
            start_date = roadmap.start_date
            end_date = roadmap.end_date

            days_elapsed = 0
            days_total = None
            days_remaining = 0
            if start_date:
                days_elapsed = (today - start_date).days
                if days_elapsed < 0:
                    days_elapsed = 0
            if start_date and end_date:
                days_total = (end_date - start_date).days
                days_remaining = (end_date - today).days
                if days_remaining < 0:
                    days_remaining = 0

            # Velocity: hours per day
            velocity = round((hours_logged / days_elapsed), 2) if days_elapsed > 0 else round(hours_logged, 2)

            # Expected completion percent by time elapsed
            expected_percent = None
            if days_total and days_total > 0:
                expected_percent = (days_elapsed / days_total) * 100

            # Status determination
            status = 'on_track'
            if expected_percent is not None:
                if progress_percentage < expected_percent - 5:
                    status = 'delayed'
                elif progress_percentage > expected_percent + 5:
                    status = 'ahead'

            data = {
                'roadmap_id': id,
                'progress_percentage': int(progress_percentage),
                'milestones_completed': milestones_completed,
                'milestones_total': milestones_total,
                'hours_logged': float(hours_logged),
                'target_hours': target_hours,
                'days_elapsed': int(days_elapsed),
                'days_remaining': int(days_remaining),
                'status': status,
                'velocity': float(velocity),
                'estimated_completion_date': end_date
            }

            return Response({'data': data})
        except Exception as e:
            print(f"Error occured while calculating progress: {str(e)}")
            return Response({'detail':f'{str(e)}'}, status=500)

    def roadmap_stats(self, id: int, organization: int, role: str) -> Response:
        try:
            total = Roadmap.objects.filter(organization=organization).count()
            completed = Roadmap.objects.filter(organization=organization, status='completed').count()
            active = Roadmap.objects.filter(organization=organization, status='active').count()
            
            return Response({
                'total': total,
                'completed': completed,
                'active': active
            })
        except Exception as e:
            print(f"Error occured while calculatinf roadmap stats: {e}")
            return Response({'detail':f'{str(e)}'}, status=500)

    def to_entity(self, obj: Roadmap) -> RoadmapEntity:
        return RoadmapEntity(
            id=obj.id,  # type: ignore
            organization=obj.organization,
            type=obj.type,
            target_hours=obj.target_hours,
            created_by=obj.created_by,
            title=obj.title,
            description=obj.description,
            status=obj.status,
            created_at=obj.created_at,
            start_date=obj.start_date,
            end_date=obj.start_date,
            milestones_count=getattr(obj, 'milestones_count', 0),
            completed_milestones_count=getattr(obj, 'completed_milestones_count', 0),
            completed_hours=getattr(obj, 'completed_hours', 0),
        )