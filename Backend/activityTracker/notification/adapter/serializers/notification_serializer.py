from rest_framework import serializers
from notification.domain.entity.notification_entity import NotificationEntity

class NotificationSerializer(serializers.Serializer):
    def to_representation(self, instance: NotificationEntity):
        return instance.__dict__
