from django.test import TestCase
from rest_framework.test import APIClient
from django.utils import timezone

from user.models import CustomUser
from organization.models import Organization, Member
from finance.models import Account, Category, Transaction


class FinanceReportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email="tester@example.com", password="pass1234")
        # make an organization and attach user
        self.org = Organization.objects.create(name="TestOrg", type="personal", created_by=self.user)
        Member.objects.create(user=self.user, organization=self.org, role="owner")
        # authenticate
        self.client.force_authenticate(user=self.user)

        # sample account/category/transactions
        self.account = Account.objects.create(
            name="Main Checking",
            organization=self.org,
            account_type="bank",
            balance=10000,
        )
        self.category_income = Category.objects.create(
            name="Salary",
            organization=self.org,
            category_type="income",
            color="green",
        )
        self.category_expense = Category.objects.create(
            name="Groceries",
            organization=self.org,
            category_type="expense",
            color="blue",
        )
        # one income and one expense transaction
        Transaction.objects.create(
            organization=self.org,
            account=self.account,
            category=self.category_income,
            amount=5000,
            transaction_type="income",
            occurred_at=timezone.now(),
            description="Salary payment",
        )
        Transaction.objects.create(
            organization=self.org,
            account=self.account,
            category=self.category_expense,
            amount=200,
            transaction_type="expense",
            occurred_at=timezone.now(),
            description="Grocery shopping",
        )

    def _get(self, path, params=None):
        # finance endpoints are mounted under /api/v1/finance/
        # ``path`` should begin with a slash and exclude the leading "finance" segment.
        full = f"/api/v1/finance{path}"
        headers = {"HTTP_X_ORG_ID": str(self.org.id)}
        return self.client.get(full, data=params or {}, **headers)

    def test_detailed_report(self):
        resp = self._get("/reports/detailed/", {"type": "income"})
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()
        self.assertIn("data", payload)
        self.assertIn("transactions", payload["data"])

    def test_category_breakdown(self):
        resp = self._get("/reports/category-breakdown/", {"type": "expense"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json().get("data")
        self.assertIsInstance(data, list)

    def test_account_breakdown(self):
        resp = self._get("/reports/account-breakdown/")
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.json().get("data"), list)

    def test_monthly_comparison(self):
        year = timezone.now().year
        resp = self._get("/reports/monthly-comparison/", {"year": year, "months": 1})
        self.assertEqual(resp.status_code, 200)
        j = resp.json().get("data")
        self.assertIn("months", j)

    def test_trend_analysis(self):
        resp = self._get("/reports/trend-analysis/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("data", resp.json())

    def test_cash_flow(self):
        resp = self._get("/reports/cash-flow/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("data", resp.json())
