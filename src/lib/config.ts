export const config = {
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    endpoints: {
      auth: "auth",
      categories: "categories",
      limits: "limits",
      sources: "sources",
      spendings: "spendings",
      monthlySpendingSummary: "spendings/summaries/months",
      downloadMonthlySpendingSummary: "spendings/summaries/months/csv",
      configs: {
        latestPayday: "configs/paydays/latest"
      }
    },
  },

  // Currency formatting
  currency: {
    code: "IDR", // Change this to your preferred currency
    locale: "id-ID", // Change this to your preferred locale
  },

  // Date formatting
  dateFormat: {
    dayAndMonth: "DD MMM YYYY",
    monthOnly: "MMM YYYY",
  },
};
