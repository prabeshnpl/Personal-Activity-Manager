class SummaryEntity:
    def __init__(
        self,
        income:float,
        expenses:float,
        balance:float,
        income_trend:dict,
        expenses_trend:dict,
    ):
        self.income = income
        self.expenses = expenses
        self.balance = balance
        self.income_trend = income_trend
        self.expenses_trend = expenses_trend
