from typing import Optional, List
from notification.models import Notification
from notification.domain.repository.notification_repo import NotificationRepository
from notification.domain.entity.notification_entity import NotificationEntity

class NotificationRepositoryImpl(NotificationRepository):

    def create_notification(self, entity: NotificationEntity) -> Optional[NotificationEntity]:
        try:
            data = entity.__dict__
                    
            # Filter only valid model fields
            field_names = [f.name for f in Notification._meta.get_fields()]
            filtered_data = {k: v for k, v in data.items() if k in field_names}
            
            instance =  Notification(**filtered_data)
            instance.save()

            return self.to_entity(instance), 200
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def get_notification_by_id(self, id: int) -> Optional[NotificationEntity]:
        try:

            instance =  Notification.objects.get(id=id)

            return self.to_entity(instance), 200
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def mark_as_read_notification(self, id:int, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        try:

            instance =  Notification.objects.filter(
                id=id, 
                recipient_id=user_id, 
                organization_id=organization_id
            ).first()

            if not instance:
                return ("Invalid notification id", 400)

            instance.is_read = True
            instance.save()            

            response = {
                "id": id,
                "is_read": True,
                "message": "Notification marked as read"
            }
            return (response, 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def mark_all_as_read_notification(self, user_id:int, organization:int) -> Optional[NotificationEntity]:
        try:

            count = Notification.objects.filter(recipient_id=user_id, organization_id=organization).update(is_read=True)

            response = {
                "updated_count": count,
                "message": "All notifications marked as read"
            }
            return (response, 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def unread_notification_count(self, user_id:int, organization_id:int):
        try:
            count = Notification.objects.filter(
                recipient_id=user_id, 
                organization_id=organization_id, 
                is_read=False
            ).count()
            response = {
                "count": count,
            }
            return (response, 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def clear_read_notification(self, user_id:int, organization_id:int):
        try:
            count, _ = Notification.objects.filter(
                recipient_id=user_id, 
                organization_id=organization_id, 
                is_read=True
            ).delete()
            response = {
                "deleted_count": count,
                "message": "Read notifications cleared"
            }
            return (response, 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)
    
    def delete_notification(self, id:int, user_id:int, organization_id:int) -> Optional[NotificationEntity]:
        try:
            instance =  Notification.objects.filter(id=id, recipient_id=user_id, organization_id=organization_id).first()
            if instance:
                instance.delete()
                return (f"Deleted Successfully", 204)
            else:
                return (f"Invalid instance id.", 400)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def list_notifications(self, search_params: dict) -> Optional[List[NotificationEntity]]:
        try:
            instances = Notification.objects.filter(
                recipient_id=search_params.get("user").id,
                organization_id=search_params.get("organization").id
            ).order_by('-id')

            return [self.to_entity(instance) for instance in instances], 200

        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def to_entity(self, obj:Notification):
        data = {k : v for k,v in obj.__dict__.items() if not k.startswith('_')}
        return NotificationEntity(**data)
        

