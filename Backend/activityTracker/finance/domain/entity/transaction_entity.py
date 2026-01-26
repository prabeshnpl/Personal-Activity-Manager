from typing import Optional
from datetime import datetime
from decimal import Decimal

class TransactionEntity:
    def __init__(
        self,
        id: int,
        organization: ['Organization'], # type: ignore
        account: ['Account'], # type: ignore
        category: ['Category'] = None, # type: ignore
        created_by: ['CustomUser'] = None, # type: ignore
        amount: Decimal = Decimal("0.00"),
        transaction_type: str = "income",
        occurred_at: Optional[datetime] = None,
        description: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.organization = organization
        self.account = account
        self.category = category
        self.created_by = created_by
        self.amount = amount
        self.transaction_type = transaction_type
        self.occurred_at = occurred_at
        self.description = description
        self.created_at = created_at

    def __str__(self):
        return f"{self.amount} ({self.transaction_type})"