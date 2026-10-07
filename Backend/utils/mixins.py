from rest_framework.exceptions import PermissionDenied
from organization.models import Member

class TenantContextMixin:
    """
    Resolves organization & role AFTER authentication.
    Attaches:
        request.organization
        request.role
    """

    def initial(self, request, *args, **kwargs):
        # 1. Let DRF authenticate the user first
        super().initial(request, *args, **kwargs) # type: ignore

        # Default values
        request.organization = None
        request.role = None

        # 2. Extract org id
        org_id = request.headers.get("X-ORG-ID")

        if not org_id:
            if self.require_organization: # type: ignore
                raise PermissionDenied("Organization context required")
            return  # org is optional for some endpoints

        try:
            org_id = int(org_id)
        except ValueError:
            raise PermissionDenied("Invalid organization header")

        # 3. Validate membership
        membership = (
            Member.objects
            .select_related("organization")
            .filter(user=request.user, organization_id=org_id)
            .first()
        )

        if not membership:
            raise PermissionDenied("You are not a member of this organization")

        # 4. Attach resolved context
        request.organization = membership.organization
        request.role = membership.role
