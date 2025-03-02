export interface Spending {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  categoryName: string;
  sourceName: string;
}

export interface SpendingFilter {
  category?: string; // Optional category filter
  startDate?: string; // Optional start date filter
  endDate?: string; // Optional end date filter
}
