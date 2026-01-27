from rest_framework.response import Response

class ReportsImpl:
    def get_reports(self, search_params, organization=None, role=None):
        try:
            return Response({
                "labels": ["Jan", "Feb", "Mar"],
                "income": [3000, 3200, 3500],
                "expenses": [1500, 1700, 1800]
            })
        except Exception as e:
            print(f"Error occured while calculating reports: {repr(e)}")
            return Response({'detail':f'{str(e)}'}, status=500)