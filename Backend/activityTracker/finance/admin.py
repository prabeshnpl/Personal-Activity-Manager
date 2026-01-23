from django.contrib import admin
from finance.models import Account, Category, Transaction

# Register your models here.
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'organization', 'created_by','amount']

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'organization', 'name', 'account_type']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'organization', 'name', 'category_type']

