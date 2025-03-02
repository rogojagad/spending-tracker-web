import { getAllSpendings } from "$lib/spending/api";
import type { Spending } from "$lib/spending/interfaces";
import type { PageLoad } from "./$types";

export interface PageData {
  spendings: Spending[];
}

export const load: PageLoad = async (): Promise<PageData> => {
  const spendings = await getAllSpendings();
  return { spendings };
};
