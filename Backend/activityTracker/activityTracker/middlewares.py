from organization.models import Member
from rest_framework.exceptions import PermissionDenied

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        org_id = request.headers.get("X-ORG-ID")

        if org_id:
            membership = Member.objects.filter(
                user=request.user,
                organization_id=org_id,
                is_active=True
            ).first()

            if not membership:
                raise PermissionDenied("Invalid organization")

            request.organization = membership.organization
            request.role = membership.role
        else:
            request.organization = None
            request.role = None

        return self.get_response(request)
