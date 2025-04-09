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
  source?: string; // Optional category filter
  fromInclusive?: string; // Optional start date filter
  toExclusive?: string; // Optional end date filter
}

export interface SpendingCategory {
  id: string;
  name: string;
  priority: number;
}

export interface SpendingSource {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SpendingCreatedAtRange {
  fromInclusive: string;
  toExclusive: string;
}

export interface MonthSpendingSummary {
  month: Date;
  total: number;
  summaries: {
    amount: number;
    categoryName: string;
  }[]
}

export interface AuthResponse {
  token: string
}