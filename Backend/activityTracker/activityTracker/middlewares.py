from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from organization.models import Member

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            print(request.user)
            if not request.user.is_authenticated:
                return JsonResponse({'detail': 'Authentication required'}, status=401)

            org_id = request.headers.get("X-ORG-ID")
            if org_id:
                org_id = int(org_id)
                membership = Member.objects.filter(
                    user=request.user,
                    organization_id=org_id,
                ).first()

                if not membership:
                    raise PermissionDenied("Invalid organization")

                request.organization = membership.organization
                request.role = membership.role
            else:
                request.organization = None
                request.role = None

            return self.get_response(request)

        except PermissionDenied as e:
            return JsonResponse({'detail': str(e)}, status=403)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=400)