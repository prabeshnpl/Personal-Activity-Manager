from django.urls import include, path
from rest_framework.routers import DefaultRouter
from notification.adapter.viewsets.notification_viewset import NotificationViewet
from notification.adapter.viewsets.fcm_test_viewset import TestPushNotification
from notification.adapter.viewsets.fcm_devices_viewset import CustomFCMDeviceViewSet

router = DefaultRouter()

router.register(r'notification', NotificationViewet, basename='notification')
router.register(r'fcm-device', CustomFCMDeviceViewSet, basename='fcm-device')

urlpatterns = [
    path('', include(router.urls)),
    path('testnotificaiton/', TestPushNotification.as_view(), name="jop" ),
]