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
        self.income = round(income,2) if income else 0
        self.expenses = round(expenses,2) if expenses else 0
        self.balance = round(balance,2) if balance else 0
        self.savings_ratio = round(savings_ratio,2) if savings_ratio else 0
        self.expense_ratio = round(expense_ratio,2) if expense_ratio else 0
        self.income_trend = income_trend
        self.expenses_trend = expenses_trend
        self.avg_daily_expense = round(avg_daily_expense,2) if avg_daily_expense else 0
