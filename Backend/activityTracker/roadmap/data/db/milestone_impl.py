from typing import List
from rest_framework.response import Response
from tasks.models import Task
from django.db import transaction
from tasks.domain.entity.task_entity import TaskEntity
from tasks.domain.repository.task_repo import TaskRepository
from tasks.models import Task
from django.db.models import Q

class TaskRepositoryImpl(TaskRepository):
    def list_tasks(self, search_params: dict, organization:int, role:str) -> List[TaskEntity] | Response:
        try:
            task = Task.objects.filter(organization=organization, is_deleted=False)

            if status:=search_params.get("status"):
                task = task.filter(status=status)

            if priority:=search_params.get('priority'):
                task = task.filter(priority=priority)

            if search:=search_params.get("search"):
                task = task.filter(
                    Q(description__icontains = search)
                    | Q(title__icontains = search)
                    | Q(priority__icontains = search)
                    | Q(status__icontains = search)
                    | Q(assigned_to__email__icontains = search)
                )

            return [self.to_entity(task) for task in task]
        except Exception as e:
            print(f"Error occured in fetching task:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_task(self, data: dict, organization:int, role:str) -> TaskEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                if data.get('status') not in ['pending', 'in_progress', 'cancelled', 'completed']:
                    return Response({'detail':"Invalid status"}, status=400)

                if data.get('priority') not in ['low', 'medium', 'high']:
                    return Response({'detail':"Invalid priority"}, status=400)

                task = Task.objects.create(**data)
                    
                return self.to_entity(task)
        except Exception as e:
            print(f"Error occured while creating task:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_task(self, id: int, data: dict, organization:int, role:str) -> TaskEntity | Response:
        try:
            print(data)
            task = Task.objects.filter(organization=organization, id=id).first()
            if not task:
                return Response({'detail':'Invalid task'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at', 'account', 'created_by']:
                    continue
                elif key=='task_type':
                    if value not in ['income', 'expense']:
                        return Response({'detail':"Invalid task_type"}, status=400)
                setattr(task, key, value)
            
            task.save()

            return self.to_entity(task) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating task:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_task_by_id(self, id: int, organization:int, role:str) -> TaskEntity | Response:
        try:
            task = Task.objects.filter(organization=organization, id=id).first()
            return self.to_entity(task) # type: ignore
        except Exception as e:
            print(f"Error occured while getting task:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_task(self, id: int, organization:int, role:str) -> Response:
        task = Task.objects.filter(organization=organization, id=id).first()
        if task:
            task.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj: Task) -> TaskEntity:
        return TaskEntity(
            id=obj.id,  # type: ignore
            organization=obj.organization,
            created_by=obj.created_by,
            assigned_to=obj.assigned_to,
            title=obj.title,
            description=obj.description,
            status=obj.status,
            priority=obj.priority,
            due_at=obj.due_at,
            completed_at=obj.completed_at,
            is_deleted=obj.is_deleted,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
        )