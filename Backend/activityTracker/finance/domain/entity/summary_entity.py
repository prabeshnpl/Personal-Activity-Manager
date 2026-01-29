class SummaryEntity:
    def __init__(
        self,
        income:float,
        expenses:float,
        balance:float,
        savings_ratio:float,
        expense_ratio:float,
        avg_daily_expense:float,
        income_trend:dict,
        expenses_trend:dict,
    ):
        self.income = round(income,2)
        self.expenses = round(expenses,2)
        self.balance = round(balance,2)
        self.savings_ratio = round(savings_ratio,2)
        self.expense_ratio = round(expense_ratio,2)
        self.income_trend = income_trend
        self.expenses_trend = expenses_trend
        self.avg_daily_expense = round(avg_daily_expense,2)
