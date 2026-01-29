from finance.domain.entity.summary_entity import SummaryEntity
from rest_framework.response import Response
from finance.domain.repository.summary_repo import SummaryRepository
from finance.models import Account, Transaction
from django.db.models import Sum
from datetime import date, timedelta

class SummaryRepositoryImpl(SummaryRepository):
    def get_summary(self, search_params, organization, role) -> SummaryEntity | Response:
        try:
            period = search_params.get('period') or 'monthly'

            transactions = Transaction.objects.filter(organization=organization)

            balance = Account.objects.filter(
                organization=organization
            ).aggregate(total=Sum('balance'))['total'] 

            data = {}
            today = date.today()

            if period == "daily":
                first_day_this_period = today
                first_day_last_period = today - timedelta(days=1)
                last_day_prev_period = today - timedelta(days=1)

            elif period == "monthly":
                first_day_this_period = today.replace(day=1)
                last_day_prev_period = first_day_this_period - timedelta(days=1)
                first_day_last_period = last_day_prev_period.replace(day=1)

            elif period == "yearly":
                first_day_this_period = today.replace(month=1, day=1)
                last_day_prev_period = first_day_this_period - timedelta(days=1)
                first_day_last_period = last_day_prev_period.replace(month=1, day=1)

            else:
                raise ValueError("Unsupported period type")

            # --- Aggregations ---
            income_this = transactions.filter(
                transaction_type="income",
                occurred_at__gte=first_day_this_period
            ).aggregate(total=Sum("amount"))["total"] or 0

            expense_this = transactions.filter(
                transaction_type="expense",
                occurred_at__gte=first_day_this_period
            ).aggregate(total=Sum("amount"))["total"] or 0

            income_last = transactions.filter(
                transaction_type="income",
                occurred_at__gte=first_day_last_period,
                occurred_at__lte=first_day_this_period
            ).aggregate(total=Sum("amount"))["total"] or 0

            expense_last = transactions.filter(
                transaction_type="expense",
                occurred_at__gte=first_day_last_period,
                occurred_at__lte=first_day_this_period
            ).aggregate(total=Sum("amount"))["total"] or 0

            # --- Percentage Change ---
            income_pct_change = (
                (income_this - income_last) / income_last * 100
                if income_last != 0 else 0
            )
            expense_pct_change = (
                (expense_this - expense_last) / expense_last * 100
                if expense_last != 0 else 0
            )

            # Ratio and avg
            savings_ratio = balance / income_this * 100 if income_this!=0 else 0
            expense_ratio = expense_this / income_this * 100 if income_this!=0 else 0

            total_days = 1 if period == 'daily' else (30 if period == 'monthly' else 365)
            avg_daily_expense = expense_this / total_days

            # --- Trend Flags ---
            income_positive = income_pct_change >= 0
            expense_positive = expense_pct_change >= 0

            data = {
                "income": income_this,
                "expenses": expense_this,
                "balance": balance,
                "income_trend": {
                    "positive": income_positive,
                    "value": f"{'+' if income_positive else ''}{income_pct_change:.2f}%"
                },
                "expenses_trend": {
                    "positive": expense_positive,
                    "value": f"{'+' if expense_positive else ''}{expense_pct_change:.2f}%"
                },
                "savings_ratio": savings_ratio,
                "expense_ratio" : expense_ratio,
                "avg_daily_expense": avg_daily_expense
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
            savings_ratio=data['savings_ratio'],
            expense_ratio=data['expense_ratio'],
            avg_daily_expense=data['avg_daily_expense'],
            balance=data['balance'],
            income_trend=data['income_trend'],
            expenses_trend=data['expenses_trend']
        )