class CaptureMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # print(f"Yes request came to:{request.path}")

        response = self.get_response(request)

        # print(f"Status code:{response.status_code}")

        return response