from rest_framework.response import Response
from django.utils import timezone
from datetime import date, timedelta
import calendar
from finance.models import Transaction

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
    
    def get_income_expense_trend(self, search_params, organization=None, role=None):
        try:
            period = search_params.get('period', 'monthly')  # weekly, monthly, yearly
            category_id = search_params.get('category')
            account_id = search_params.get('account')
            # Build queryset with filters
            queryset = Transaction.objects.\
                filter(organization=organization).\
                exclude(category__category_type="transfer")
            
            if category_id:
                queryset = queryset.filter(category_id=category_id)
            if account_id:
                queryset = queryset.filter(account_id=account_id)
            
            # Determine date range and fixed buckets
            now = timezone.localtime(timezone.now())
            today = now.date()
            bucket_definitions = []

            if period == 'weekly':
                end_date = today
                start_date = end_date - timedelta(days=6)
                period_label = "weekly"
                bucket_definitions = [start_date + timedelta(days=i) for i in range(7)]
            elif period == 'yearly':
                end_year = today.year
                start_year = end_year - 1
                start_date = date(start_year, 1, 1)
                end_date = date(end_year, 12, 31)
                period_label = "yearly"
                bucket_definitions = [start_year, end_year]
            else:  # monthly -> fixed fiscal year window: Mar to Feb
                fiscal_start_year = today.year if today.month >= 3 else today.year - 1
                start_date = date(fiscal_start_year, 3, 1)
                fiscal_end_year = fiscal_start_year + 1
                end_date = date(
                    fiscal_end_year,
                    2,
                    calendar.monthrange(fiscal_end_year, 2)[1]
                )
                period_label = "monthly"
                bucket_definitions = []
                for idx in range(12):
                    month_num = ((3 - 1 + idx) % 12) + 1
                    year_num = fiscal_start_year + ((3 - 1 + idx) // 12)
                    bucket_definitions.append(date(year_num, month_num, 1))

            queryset = queryset.filter(
                occurred_at__date__gte=start_date,
                occurred_at__date__lte=end_date
            )

            transactions = queryset.\
                values('occurred_at', 'transaction_type', 'amount').\
                order_by('occurred_at')

            period_data = {}
            if period == 'weekly':
                for bucket_date in bucket_definitions:
                    period_data[bucket_date] = {'income': 0, 'expense': 0}
            elif period == 'yearly':
                for bucket_year in bucket_definitions:
                    period_data[bucket_year] = {'income': 0, 'expense': 0}
            else:
                for bucket_month in bucket_definitions:
                    period_data[(bucket_month.year, bucket_month.month)] = {'income': 0, 'expense': 0} # type: ignore

            for txn in transactions:
                occurred = timezone.localtime(txn['occurred_at'])

                if period == 'weekly':
                    key = occurred.date()
                elif period == 'yearly':
                    key = occurred.year
                else:
                    key = (occurred.year, occurred.month)

                if key not in period_data:
                    continue

                if txn['transaction_type'] == 'income':
                    period_data[key]['income'] += txn['amount']
                else:
                    period_data[key]['expense'] += txn['amount']

            series = []
            total_income = 0
            total_expense = 0

            for bucket in bucket_definitions:
                if period == 'weekly':
                    label = bucket.strftime('%a %b %d') # type: ignore
                    data = period_data[bucket]
                elif period == 'yearly':
                    label = str(bucket)
                    data = period_data[bucket]
                else:
                    label = bucket.strftime('%b %Y') # type: ignore
                    data = period_data[(bucket.year, bucket.month)] # type: ignore

                series.append({
                    'label': label,
                    'income': int(data['income']),
                    'expense': int(data['expense'])
                })
                total_income += data['income']
                total_expense += data['expense']
            
            # Build applied filters dict
            applied_filters = {}
            if category_id:
                applied_filters['category'] = str(category_id)
            if account_id:
                applied_filters['account'] = str(account_id)
            
            return Response({
                'period': period_label,
                'applied_filters': applied_filters,
                'series': series,
                'totals': {
                    'income': int(total_income),
                    'expense': int(total_expense),
                    'balance': int(total_income - total_expense)
                }
            })
        except Exception as e:
            print(f"Error occured while calculating reports: {e}")
            return Response({'detail':f'{str(e)}'}, status=500)
    
    def get_detailed_reports(self, search_params, organization=None, role=None):
        """Return a detailed list of transactions along with summary and grouped data."""
        try:
            txn_type = search_params.get('type')
            category_param = search_params.get('category')
            account_param = search_params.get('account')
            start_date = search_params.get('start_date')
            end_date = search_params.get('end_date')
            group_by = search_params.get('group_by')

            queryset = Transaction.objects.filter(organization=organization)

            # apply simple filters
            if txn_type in ('income', 'expense'):
                queryset = queryset.filter(transaction_type=txn_type)
            if category_param:
                try:
                    ids = [int(x) for x in str(category_param).split(',') if x]
                    queryset = queryset.filter(category_id__in=ids)
                except ValueError:
                    pass
            if account_param:
                try:
                    ids = [int(x) for x in str(account_param).split(',') if x]
                    queryset = queryset.filter(account_id__in=ids)
                except ValueError:
                    pass
            if start_date:
                queryset = queryset.filter(occurred_at__date__gte=start_date)
            if end_date:
                queryset = queryset.filter(occurred_at__date__lte=end_date)

            # retrieve ordered transactions and prefetch related to avoid N+1
            txns = queryset.select_related('category', 'account').order_by('occurred_at')

            transactions = []
            total_amount = 0
            for txn in txns:
                total_amount += txn.amount
                transactions.append({
                    'id': txn.id,
                    'date': txn.occurred_at.date().isoformat(),
                    'description': txn.description,
                    'amount': txn.amount,
                    'type': txn.transaction_type,
                    'category': {
                        'id': txn.category.id if txn.category else None, # type: ignore
                        'name': txn.category.name if txn.category else None,
                        'color': txn.category.color if txn.category else None,
                    } if txn.category else None,
                    'account': {
                        'id': txn.account.id, # type: ignore
                        'name': txn.account.name,
                    }
                })

            count = len(transactions)
            avg = int(total_amount / count) if count else 0

            summary = {
                'total_amount': total_amount,
                'transaction_count': count,
                'average_transaction': avg,
                'period': {'start': start_date, 'end': end_date}
            }

            grouped_data = {}
            if group_by and total_amount > 0:
                from collections import defaultdict
                if group_by == 'category':
                    stats = defaultdict(lambda: {'total': 0, 'count': 0})
                    for txn in txns:
                        key = txn.category.name if txn.category else 'Uncategorized'
                        stats[key]['total'] += txn.amount
                        stats[key]['count'] += 1
                elif group_by == 'account':
                    stats = defaultdict(lambda: {'total': 0, 'count': 0})
                    for txn in txns:
                        key = txn.account.name if txn.account else 'Unknown'
                        stats[key]['total'] += txn.amount
                        stats[key]['count'] += 1
                elif group_by == 'month':
                    stats = defaultdict(lambda: {'total': 0, 'count': 0})
                    for txn in txns:
                        key = txn.occurred_at.strftime('%Y-%m')
                        stats[key]['total'] += txn.amount
                        stats[key]['count'] += 1
                else:
                    stats = {}

                # calculate percentages
                for key, val in stats.items():
                    val['percentage'] = round(val['total'] / total_amount * 100, 2) if total_amount else 0
                grouped_data = dict(stats)

            return Response({'data': {'summary': summary, 'transactions': transactions, 'grouped_data': grouped_data}})
        except Exception as e:
            print(f"Error occured while calculating detailed reports: {e}")
            return Response({'detail': str(e)}, status=500)
