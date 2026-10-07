from rest_framework.routers import DefaultRouter
from django.urls import path, include
from finance.adapter.viewsets.account_viewset import AccountViewset
from finance.adapter.viewsets.category_viewset import CategoryViewset
from finance.adapter.viewsets.reports_viewset import ReportView
from finance.adapter.viewsets.summary_viewset import SummaryView
from finance.adapter.viewsets.transaction_view import TransactionViewset

router = DefaultRouter()
router.register(r"account", AccountViewset, basename="account")
router.register(r"category", CategoryViewset, basename="category")
router.register(r"transaction", TransactionViewset, basename="transaction")
router.register(r"summary", SummaryView, basename="summary")
router.register(r"reports", ReportView, basename="reports")

urlpatterns = [
    path("", include(router.urls)),
]