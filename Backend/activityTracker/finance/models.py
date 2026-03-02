from django.db import models
from organization.models import Organization
from user.models import CustomUser

class Account(models.Model):
    ACCOUNT_TYPE_CHOICES = (
        ('cash', 'Cash'),
        ('bank', 'Bank'),
        ('digital', 'Digital'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="accounts",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=128)
    
    balance = models.FloatField()

    account_type = models.CharField(
        max_length=32,
        choices=ACCOUNT_TYPE_CHOICES
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    CATEGORY_TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('loan-taken', 'LOAN-TAKEN'),
        ('loan-given', 'LOAN-GIVEN'),
        ('transfer', 'Transfer'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="categories",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=128)

    category_type = models.CharField(
        max_length=16,
        choices=CATEGORY_TYPE_CHOICES
    )

    color = models.CharField(max_length=32, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('organization', 'name')

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="transactions",
        on_delete=models.CASCADE
    )

    account = models.ForeignKey(
        Account,
        related_name="transactions",
        on_delete=models.PROTECT
    )

    category = models.ForeignKey(
        Category,
        related_name="transactions",
        on_delete=models.SET_NULL,
        null=True
    )

    created_by = models.ForeignKey(
        CustomUser,
        related_name="transactions",
        on_delete=models.SET_NULL,
        null=True
    )

    amount = models.FloatField()

    remaining_balance = models.FloatField(blank=True, null=True)

    transaction_type = models.CharField(
        max_length=16,
        choices=TRANSACTION_TYPE_CHOICES
    )

    occurred_at = models.DateTimeField()

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} ({self.transaction_type})"

