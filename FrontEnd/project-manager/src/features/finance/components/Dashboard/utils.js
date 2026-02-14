export const formatCompactCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(amount || 0));

export const normalizeTrendData = (trendData) => {
  if (!Array.isArray(trendData)) return [];
  return trendData.map((point) => ({
    label:
      point.label ||
      point.bucket_label ||
      point.bucket ||
      point.period ||
      point.date ||
      "",
    income: Number(point.income_total ?? point.income ?? 0),
    expense: Number(point.expense_total ?? point.expense ?? 0),
  }));
};

export const periodLabelMap = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};
