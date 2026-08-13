from rest_framework.views import APIView
from utils.firebase_helper import send_notification
from rest_framework.response import Response

class TestPushNotification(APIView):
    def get(self, request):
        response = send_notification(user_ids=[2], title="Testing", body="hello")
        return Response({'detail':response}, status=200)