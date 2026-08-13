from notification.models import Notification
from notification.adapter.serializers.notification_serializer import NotificationSerializer
from notification.domain.usecase.notification_usecase import (
    ClearReadNotificationUsecase, DeleteNotificationUseCase, ListNotificationsUseCase, 
    MarkAllAsReadNotificationUseCase, MarkAsReadNotificationUseCase, UnreadCountNotificationUsecase
)
from notification.data.db.notification_repo_impl import NotificationRepositoryImpl
from utils.tenantViewsets import BaseTenantModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils.pagniator import CustomPageNumberPagination
from rest_framework.decorators import action

class NotificationViewet(BaseTenantModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    require_organization = True
    repository = NotificationRepositoryImpl
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = CustomPageNumberPagination
    queryset = Notification.objects.all()

    def list(self, request, *args, **kwargs):
        usecase = ListNotificationsUseCase(repo=self.repository())

        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        search_params['organization'] = request.organization

        _response, status_code = usecase.execute(search_params=search_params)

        if status_code!=200:
            return Response(_response, status=int(status_code))
        
        page = self.paginate_queryset(_response)

        serializer = self.get_serializer(
            page, many=True,
            context={
                "timezone": request.headers.get("X-Timezone"), 
                "request":request
            }
        )

        response = self.get_paginated_response(serializer.data)
        response.data['count'] = len(_response)
        return response
       
    def destroy(self, request, *args, **kwargs):

        usecase = DeleteNotificationUseCase(repo=self.repository())

        data = {
            "id": kwargs.get("pk"),
            "organization_id":request.organization.id,
            "user_id":request.user.id
        }
        response, status_code = usecase.execute(data=data)

        return Response(response,status=status_code)

    @action(methods=['POST'], detail=True, url_path="mark_as_read")
    def mark_as_read(self, request, *args, **kwargs):
        
        data = {
            "id": kwargs.get("pk"),
            "organization_id":request.organization.id,
            "user_id":request.user.id
        }

        usecase = MarkAsReadNotificationUseCase(repo=self.repository())

        response, status_code = usecase.execute(data=data)

        return Response(data=response, status=status_code)
    
    @action(methods=['POST'], detail=False, url_path="mark_all_as_read")
    def mark_all_as_read(self, request, *args, **kwargs):
        data = {
            "organization_id":request.organization.id,
            "user_id":request.user.id
        }

        usecase = MarkAllAsReadNotificationUseCase(repo=self.repository())

        response, status_code = usecase.execute(data=data)

        return Response(data=response, status=status_code)

    @action(methods=['POST'], detail=False, url_path="clear-read")
    def clear_read(self, request, *args, **kwargs):
        data = {
            "organization_id":request.organization.id,
            "user_id":request.user.id
        }

        usecase = ClearReadNotificationUsecase(repo=self.repository())

        response, status_code = usecase.execute(data=data)

        return Response(data=response, status=status_code)

    @action(methods=['GET'], detail=False, url_path="unread-count")
    def unread_count(self, request, *args, **kwargs):
        data = {
            "organization_id":request.organization.id,
            "user_id":request.user.id
        }

        usecase = UnreadCountNotificationUsecase(repo=self.repository())

        response, status_code = usecase.execute(data=data)

        return Response(data=response, status=status_code)
    