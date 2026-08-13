from rest_framework import permissions
from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet # type: ignore

class CustomFCMDeviceViewSet(FCMDeviceAuthorizedViewSet):
    """
    API endpoint for managing FCM devices for push notifications.
    - Requires authentication.
    - Associates created devices with the current user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Register a new FCM device.
        Payload Expected from frontend
        {
            "registration_id": "EXACT_FCM_TOKEN_FROM_SDK",
            "type": "web",  // "web", "android", or "ios"
            "name": "User's Chrome Browser"  // Optional
        }
        """
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)