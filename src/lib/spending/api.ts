import { config } from "$lib/config";
import ky from "ky";
import type { Spending, SpendingFilter } from "./interfaces";

const httpClient = ky.create({
  prefixUrl: config.api.baseUrl,
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      (error) => {
        // You can add custom error handling here
        console.error(`API Error: ${error.message}`);
        return error;
      },
    ],
  },
});

export async function getAllSpendings(): Promise<Spending[]> {
  try {
    const response = await httpClient
      .get<Spending[]>(config.api.endpoints.spendings)
      .json();
    return response || [];
  } catch (error) {
    console.error(`Failed fetching spendings ${error}`, error);
    throw error;
  }
}

export async function getFilteredSpendings(
  spendingFilter: SpendingFilter,
): Promise<Spending[]> {
  try {
    const searchParam = new URLSearchParams();

    if (spendingFilter.category)
      searchParam.set("category", spendingFilter.category);

    if (spendingFilter.startDate)
      searchParam.set("startDate", spendingFilter.startDate);

    if (spendingFilter.endDate)
      searchParam.set("endDate", spendingFilter.endDate);

    const response = await httpClient
      .get<Spending[]>(config.api.endpoints.spendings)
      .json();

    return response;
  } catch (error) {
    console.error(`Failed fetching filtered spendings ${error}`, error);
    throw error;
  }
}
