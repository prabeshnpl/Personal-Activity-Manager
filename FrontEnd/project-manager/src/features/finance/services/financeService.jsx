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
  getSummary: (period) =>
    api.get(`${ENDPOINTS.FINANCE_SUMMARY}/`, { params: { period } }),

  getReports: (params) =>
    api.get(`${ENDPOINTS.FINANCE_REPORTS}/`, { params }),

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

  // Export
  exportTransactions: (format, params) =>
    api.get(`${ENDPOINTS.FINANCE_EXPORT}/`, {
      params: { format, ...params },
      responseType: 'blob',
    }),
};