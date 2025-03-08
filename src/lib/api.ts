import { config } from "$lib/config";
import ky from "ky";
import type {
  AuthResponse,
  Spending,
  SpendingCategory,
  SpendingFilter,
  SpendingSource,
} from "./interfaces";
import { authStore } from "./stores/auth";

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

export async function getManySpendings(
  spendingFilter?: SpendingFilter,
): Promise<Spending[]> {
  const { token } = authStore.getToken()
  try {
    const searchParam = new URLSearchParams();

    if (spendingFilter?.category)
      searchParam.set("category", spendingFilter.category);

    if (spendingFilter?.source)
      searchParam.set("source", spendingFilter.source);

    if (spendingFilter?.fromInclusive)
      searchParam.set("fromInclusive", spendingFilter.fromInclusive);

    if (spendingFilter?.toExclusive)
      searchParam.set("toExclusive", spendingFilter.toExclusive);

    const response = await httpClient
      .get<
        Spending[]
      >(config.api.endpoints.spendings, { searchParams: searchParam, headers: { Authorization: `Bearer ${token}` } })
      .json();

    return response;
  } catch (error) {
    console.error(`Failed fetching filtered spendings ${error}`, error);
    throw error;
  }
}

export async function getAllCategories(): Promise<SpendingCategory[]> {
  const { token } = authStore.getToken()
  try {
    const response = await httpClient
      .get<SpendingCategory[]>(config.api.endpoints.categories, { headers: { Authorization: `Bearer ${token}` } })
      .json();

    return response;
  } catch (error) {
    console.error(`Failed fetching categories ${error}`, error);
    throw error;
  }
}

export async function getAllSources(): Promise<SpendingSource[]> {
  const { token } = authStore.getToken()
  try {
    const response = await httpClient
      .get<SpendingSource[]>(config.api.endpoints.sources, { headers: { Authorization: `Bearer ${token}` } })
      .json();

    return response;
  } catch (error) {
    console.error(`Failed fetching categories ${error}`, error);
    throw error;
  }
}

export async function auth(password: string): Promise<AuthResponse> {
  try {
    const response = await httpClient.post<AuthResponse>(config.api.endpoints.auth, { json: { password } }).json()
    return response
  } catch (error) {
    console.error(`Failed doing auth ${error}`, error);
    throw error;
  }
}