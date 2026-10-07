class SummaryEntity:
    def __init__(
        self,
        income:float,
        expenses:float,
        balance:float,
        income_trend:dict,
        expenses_trend:dict,
    ):
        self.income = round(income,2) if income else 0
        self.expenses = round(expenses,2) if expenses else 0
        self.balance = round(balance,2) if balance else 0
        self.income_trend = income_trend
        self.expenses_trend = expenses_trend
