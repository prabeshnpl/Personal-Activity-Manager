import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const financeService = {
  // Transactions
  getTransactions: (params) =>
    api.get(`${ENDPOINTS.FINANCE_TRANSACTIONS}/`, { params }),

  createTransaction: (data) =>
    api.post(`${ENDPOINTS.FINANCE_TRANSACTIONS}/`, data),

  updateTransaction: (id, data) =>
    api.patch(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}/`, data),

  deleteTransaction: (id) =>
    api.delete(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}/`),

  getTransactionById: (id) =>
    api.get(`${ENDPOINTS.FINANCE_TRANSACTIONS}/${id}/`),

  // Summary & Reports
  getSummary: (params) =>
    api.get(`${ENDPOINTS.FINANCE_SUMMARY}/`, { params }),

  getReports: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/`, { params }),

  getIncomeExpenseTrend: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/income-expense-trend/`, {
      params,
    }),

  getCategoryBreakdown: (params) =>
    api.get(`${ENDPOINTS.FINANCE_CATEGORY_BREAKDOWN}/`, { params }),

  getMemberWiseBreakdown: (params) =>
    api.get(`${ENDPOINTS.FINANCE_MEMBER_BREAKDOWN}/`, { params }),

  // Categories
  getCategories: () =>
    api.get(`${ENDPOINTS.FINANCE_CATEGORIES}/`),

  createCategory: (data) =>
    api.post(`${ENDPOINTS.FINANCE_CATEGORIES}/`, data),

  updateCategory: (id, data) =>
    api.patch(`${ENDPOINTS.FINANCE_CATEGORIES}/${id}/`, data),

  deleteCategory: (id) =>
    api.delete(`${ENDPOINTS.FINANCE_CATEGORIES}/${id}/`),

  // Accounts (Bank accounts, Credit cards, etc.)
  getAccounts: (params) =>
    api.get(`${ENDPOINTS.FINANCE_ACCOUNTS}/`, { params }),

  createAccount: (data) =>
    api.post(`${ENDPOINTS.FINANCE_ACCOUNTS}/`, data),

  updateAccount: (id, data) =>
    api.patch(`${ENDPOINTS.FINANCE_ACCOUNTS}/${id}/`, data),

  deleteAccount: (id) =>
    api.delete(`${ENDPOINTS.FINANCE_ACCOUNTS}/${id}/`),

  getAccountBalance: (id) =>
    api.get(`${ENDPOINTS.FINANCE_ACCOUNTS}/${id}/balance/`),

  // Reports
  getDetailedReport: (params = {}) => {
    const query = new URLSearchParams();

    if (params.type) {
      query.append("type", params.type);
    }

    const categories = Array.isArray(params.category) ? params.category : [];
    if (categories.length === 0) {
      query.append("category[]", "");
    } else {
      categories.forEach((categoryId) => {
        query.append("category[]", String(categoryId));
      });
    }

    const accounts = Array.isArray(params.account) ? params.account : [];
    if (accounts.length === 0) {
      query.append("account[]", "");
    } else {
      accounts.forEach((accountId) => {
        query.append("account[]", String(accountId));
      });
    }

    if (params.startDate) {
      query.append("startDate", params.startDate);
    }

    if (params.endDate) {
      query.append("endDate", params.endDate);
    }

    if (params.groupBy) {
      query.append("groupBy", params.groupBy);
    }

    return api.get(`${ENDPOINTS.FINANCE_REPORTS}/detailed/?${query.toString()}`);
  },

  getAccountBreakdown: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/account-breakdown/`, { params }),

  getMonthlyComparison: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/monthly-comparison/`, { params }),

  getTrendAnalysis: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/trend-analysis/`, { params }),

  getCashFlow: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/cash-flow/`, { params }),

  // Export
  exportReport: (format, params) =>
    api.get(`${ENDPOINTS.FINANCE_EXPORT}/`, {
      params: { format, ...params },
      responseType: 'blob',
    }),
};
