from typing import Optional, List
from Backend.activityTracker.notification.models import Notification
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

            return self.to_entity(instance), 200
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def get_notification_by_id(self, id: int) -> Optional[NotificationEntity]:
        try:

            instance =  Notification.objects.get(id=id)

            return self.to_entity(instance), 200
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def mark_as_read_notification(self, user_id:int, organization:int) -> Optional[NotificationEntity]:
        try:

            instance =  Notification.objects.filter(id=id, recipient=user_id, organization=organization).first()

            if not instance:
                return ("Invalid notification id", 400)

            instance.is_read = True
            instance.save()            

            return ("Success", 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def mark_all_as_read_notification(self, user_id:int, organization:int) -> Optional[NotificationEntity]:
        try:

            Notification.objects.filter(recipient=user_id, organization=organization).update(is_read=True)

            return ("Success", 200)
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def delete_notification(self, id: int) -> Optional[NotificationEntity]:
        try:
            instance =  Notification.objects.get(id=id)
            if instance:
                instance.delete()
                return f"Deleted Successfully", 200
            else:
                return f"Invalid instance id.", 400
        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def list_notifications(self, search_params: dict) -> Optional[List[NotificationEntity]]:
        try:
            instances = Notification.objects.filter(
                recipient=search_params.get("user_id"),
                organization=search_params.get("organization")
            ).order_by('-id')

            return [self.to_entity(instance) for instance in instances], 200

        except Exception as e:
            return (f"Error : {str(e)}", 500)

    def to_entity(obj:Notification):
        return NotificationEntity(**obj.__dict__)
        

