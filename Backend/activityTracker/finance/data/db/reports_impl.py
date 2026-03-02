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
                    'id': txn.id, # type: ignore
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
                    stats = defaultdict(lambda: {'total': 0.0, 'count': 0.0})
                    for txn in txns:
                        key = txn.category.name if txn.category else 'Uncategorized'
                        stats[key]['total'] += txn.amount
                        stats[key]['count'] += 1
                elif group_by == 'account':
                    stats = defaultdict(lambda: {'total': 0.0, 'count': 0.0})
                    for txn in txns:
                        key = txn.account.name if txn.account else 'Unknown'
                        stats[key]['total'] += txn.amount
                        stats[key]['count'] += 1
                elif group_by == 'month':
                    stats = defaultdict(lambda: {'total': 0.0, 'count': 0.0})
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

    def get_category_breakdown(self, search_params, organization=None, role=None):
        """Return totals grouped by category for a given type/date range."""
        try:
            txn_type = search_params.get('type')
            start_date = search_params.get('start_date')
            end_date = search_params.get('end_date')

            queryset = Transaction.objects.filter(organization=organization)
            queryset = queryset.exclude(category__category_type="transfer")
            if txn_type in ('income', 'expense'):
                queryset = queryset.filter(transaction_type=txn_type)
            if start_date:
                queryset = queryset.filter(occurred_at__date__gte=start_date)
            if end_date:
                queryset = queryset.filter(occurred_at__date__lte=end_date)

            from django.db.models import Sum, Count, Avg
            categories = queryset.values(
                'category_id',
                'category__name',
                'category__color',
            ).annotate(
                total_amount=Sum('amount'),
                transaction_count=Count('id'),
                average_per_transaction=Avg('amount'),
            )

            total_amount = queryset.aggregate(total=Sum('amount'))['total'] or 0
            data = []
            for cat in categories:
                pct = round(cat['total_amount'] / total_amount * 100, 2) if total_amount else 0
                data.append({
                    'category_id': cat['category_id'],
                    'category_name': cat['category__name'],
                    'category_color': cat['category__color'],
                    'total_amount': cat['total_amount'] or 0,
                    'transaction_count': cat['transaction_count'],
                    'percentage': pct,
                    'average_per_transaction': cat['average_per_transaction'] or 0,
                })

            return Response({'data': data})
        except Exception as e:
            print(f"Error occured while calculating category breakdown: {e}")
            return Response({'detail': str(e)}, status=500)

    def get_account_breakdown(self, search_params, organization=None, role=None):
        """Return totals grouped by account including income/expense/net and current balance."""
        try:
            start_date = search_params.get('start_date')
            end_date = search_params.get('end_date')

            queryset = Transaction.objects.filter(organization=organization)
            queryset = queryset.exclude(category__category_type="transfer")
            if start_date:
                queryset = queryset.filter(occurred_at__date__gte=start_date)
            if end_date:
                queryset = queryset.filter(occurred_at__date__lte=end_date)

            from django.db.models import Sum, Count, Q
            accounts = queryset.values(
                'account_id',
                'account__name',
                'account__account_type',
                'account__balance',
            ).annotate(
                total_income=Sum('amount', filter=Q(transaction_type='income')),
                total_expense=Sum('amount', filter=Q(transaction_type='expense')),
                transaction_count=Count('id'),
            )

            data = []
            for acc in accounts:
                income = acc['total_income'] or 0
                expense = acc['total_expense'] or 0
                net = income - expense
                data.append({
                    'account_id': acc['account_id'],
                    'account_name': acc['account__name'],
                    'account_type': acc['account__account_type'],
                    'total_income': income,
                    'total_expense': expense,
                    'net_change': net,
                    'transaction_count': acc['transaction_count'],
                    'current_balance': acc['account__balance'] or 0,
                })

            return Response({'data': data})
        except Exception as e:
            print(f"Error occured while calculating account breakdown: {e}")
            return Response({'detail': str(e)}, status=500)

    def get_monthly_comparison(self, search_params, organization=None, role=None):
        """Return a comparison of income/expenses/net for a sequence of months."""
        try:
            year = int(search_params.get('year', date.today().year))
            months_count = int(search_params.get('months', 6))

            from django.db.models import Sum
            labels = []
            income_series = []
            expense_series = []

            for m in range(1, months_count + 1):
                if m > 12:
                    break
                labels.append(calendar.month_abbr[m])
                start = date(year, m, 1)
                last_day = calendar.monthrange(year, m)[1]
                end = date(year, m, last_day)

                qs = Transaction.objects.filter(
                    organization=organization,
                    occurred_at__date__gte=start,
                    occurred_at__date__lte=end,
                ).exclude(category__category_type="transfer")
                inc = qs.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
                exp = qs.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0
                income_series.append(int(inc))
                expense_series.append(int(exp))

            net_series = [i - e for i, e in zip(income_series, expense_series)]

            # basic trend heuristics
            def trend(vals):
                if len(vals) < 2:
                    return 'stable'
                if vals[-1] > vals[0]:
                    return 'increasing'
                if vals[-1] < vals[0]:
                    return 'decreasing'
                return 'stable'

            comparison = {
                'income_trend': trend(income_series),
                'expense_trend': trend(expense_series),
                'best_month': labels[net_series.index(max(net_series))] if net_series else None,
                'worst_month': labels[net_series.index(min(net_series))] if net_series else None,
            }

            return Response({'data': {
                'months': labels,
                'income': income_series,
                'expenses': expense_series,
                'net': net_series,
                'comparison': comparison,
            }})
        except Exception as e:
            print(f"Error occured while calculating monthly comparison: {e}")
            return Response({'detail': str(e)}, status=500)

    def get_trend_analysis(self, search_params, organization=None, role=None):
        """Return simple trend statistics from historical transactions."""
        try:
            from django.db.models import Avg, Count, Sum
            qs = Transaction.objects.filter(organization=organization).exclude(category__category_type="transfer")
            today = date.today()
            last_30 = today - timedelta(days=30)
            last_7 = today - timedelta(days=7)

            daily_avg = qs.filter(occurred_at__date__gte=last_30).aggregate(avg=Avg('amount'))['avg'] or 0
            weekly_avg = qs.filter(occurred_at__date__gte=last_7).aggregate(total=Sum('amount'))['total'] or 0
            monthly_avg = daily_avg * 30

            # spending pattern: compare last month to previous month
            prev_month_start = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
            prev_month_end = today.replace(day=1) - timedelta(days=1)
            this_month_start = today.replace(day=1)
            this_month_total = qs.filter(occurred_at__date__gte=this_month_start).aggregate(total=Sum('amount'))['total'] or 0
            prev_month_total = qs.filter(occurred_at__date__gte=prev_month_start, occurred_at__date__lte=prev_month_end).aggregate(total=Sum('amount'))['total'] or 0
            if this_month_total > prev_month_total:
                pattern = 'increasing'
            elif this_month_total < prev_month_total:
                pattern = 'decreasing'
            else:
                pattern = 'stable'

            # peak / lowest spending day of week
            from django.db.models.functions import ExtractWeekDay
            weekday_totals = (
                qs.annotate(weekday=ExtractWeekDay('occurred_at'))
                  .values('weekday')
                  .annotate(total=Sum('amount'))
                  .order_by('weekday')
            )
            # map Django weekday 1=Sunday
            day_names = {1:'Sunday',2:'Monday',3:'Tuesday',4:'Wednesday',5:'Thursday',6:'Friday',7:'Saturday'}
            peak = None
            low = None
            if weekday_totals:
                peak_rec = max(weekday_totals, key=lambda r: r['total'] or 0)
                low_rec = min(weekday_totals, key=lambda r: r['total'] or 0)
                peak = day_names.get(peak_rec['weekday'])
                low = day_names.get(low_rec['weekday'])

            # simple forecast: assume this month's total continues
            forecast = int(this_month_total)

            return Response({'data': {
                'daily_average': float(daily_avg),
                'weekly_average': float(weekly_avg),
                'monthly_average': float(monthly_avg),
                'spending_pattern': pattern,
                'peak_spending_day': peak,
                'lowest_spending_day': low,
                'forecast_next_month': forecast,
            }})
        except Exception as e:
            print(f"Error occured while calculating trend analysis: {e}")
            return Response({'detail': str(e)}, status=500)

    def get_cash_flow(self, search_params, organization=None, role=None):
        """Return simple cash flow stats using account balances and transaction history."""
        try:
            from django.db.models import Sum
            from finance.models import Account

            opening_balance = Account.objects.filter(organization=organization).aggregate(total=Sum('balance'))['total'] or 0

            qs = Transaction.objects.filter(organization=organization).exclude(category__category_type="transfer")
            total_inflow = qs.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
            total_outflow = qs.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0

            net_change = total_inflow - total_outflow
            closing_balance = opening_balance + net_change
            burn_rate = total_outflow / 30 if total_outflow else 0
            runway = closing_balance / burn_rate if burn_rate else None

            return Response({'data': {
                'opening_balance': opening_balance,
                'total_inflow': total_inflow,
                'total_outflow': total_outflow,
                'closing_balance': closing_balance,
                'net_change': net_change,
                'burn_rate': round(burn_rate, 2),
                'runway_months': round(runway, 2) if runway is not None else None,
            }})
        except Exception as e:
            print(f"Error occured while calculating cash flow: {e}")
            return Response({'detail': str(e)}, status=500)
