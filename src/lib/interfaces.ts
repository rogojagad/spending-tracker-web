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

export interface DateRange {
  fromInclusive: string;
  toExclusive: string;
}

export interface MonthSpendingSummary {
  month: Date;
  total: number;
  summaries: {
    amount: number;
    categoryName: string;
  }[];
}

export interface Limit {
  id: string;
  name: string;
  value: number;
  categoryId?: string;
  sourceId?: string;
  categoryName?: string;
  sourceName?: string;
  usedValue: number;
  usedPercentage: number;
}

export interface AuthResponse {
  token: string;
}

export interface Payday {
  id: string;
  note: string;
  paydayDate: Date;
  createdAt: Date;
  updatedAt: Date;
}