export const ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  ME: '/auth/me',
  
  // Organizations
  ORGANIZATIONS: '/organization',
  ORGANIZATION_DETAIL: (id) => `/organization/${id}`,
  ORGANIZATION_MEMBERS: (id) => `/organization/${id}/members`,
  SWITCH_ORGANIZATION: (id) => `/organization/${id}/switch`,

  //MEMBERS
  MEMBERS: '/member',

  // Finance
  FINANCE_TRANSACTIONS: '/finance/transaction',
  FINANCE_ACCOUNTS: '/finance/account',
  FINANCE_SUMMARY: '/finance/summary',
  FINANCE_REPORTS: '/finance/reports',
  FINANCE_CATEGORY_BREAKDOWN: '/finance/category/breakdown',
  FINANCE_MEMBER_BREAKDOWN: '/member/breakdown',
  FINANCE_CATEGORIES: '/finance/category',
  FINANCE_EXPORT: '/finance/export',

  // Tasks
  TASKS: '/tasks',
};