from notification.adapter.serializers.notification_serializer import NotificationSerializer
from notification.domain.usecase.notification_usecase import ListNotificationsUseCase, MarkAllAsReadNotificationUseCase, MarkAsReadNotificationUseCase
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

    def list(self, request, *args, **kwargs):
        usecase = ListNotificationsUseCase(repo=self.repository())
        search_params = {k: v[0] if isinstance(v, list) else v for k, v in request.query_params.items()}
        search_params['user'] = request.user
        search_params['organization'] = request.organization
        response, status_code = usecase.execute(search_params=search_params)

        serializer = self.get_serializer(response, many=True)

        if status_code!=200:
            return Response(response, status=int(status_code))
       
        return Response(serializer.data, status=int(status_code))

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