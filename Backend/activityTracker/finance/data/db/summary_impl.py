from finance.domain.entity.summary_entity import SummaryEntity
from rest_framework.response import Response
from finance.domain.repository.summary_repo import SummaryRepository

class SummaryRepositoryImpl(SummaryRepository):
    def get_summary(self, search_params, organization, role) -> SummaryEntity | Response:
        try:
            period = search_params.get('period') or 'monthly'

            # if period == 'monthly':
            data = {
                "income": 3500,
                "expenses": 1800,
                "balance": 1700,
                "income_trend": {
                "positive": True,
                "value": "+12%"
                },
                "expenses_trend": {
                "positive": False,
                "value": "-5%"
                }
            }
            entity = self.to_entity(data=data)
            return entity

        except Exception as e:
            print(f"Error occured while calculating summary: {repr(e)}")
            return Response({'detail':f'{str(e)}'}, status=500)

    def to_entity(self, data:dict) -> SummaryEntity:
        return SummaryEntity(
            income=data['income'],
            expenses=data['expenses'],
            balance=data['balance'],
            income_trend=data['income_trend'],
            expenses_trend=data['expenses_trend']
        )