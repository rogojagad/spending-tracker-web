import { browser } from "$app/environment";
import { getManySpendings } from "$lib/api";
import type { Spending } from "$lib/interfaces";
import type { PageLoad } from "./$types";

export interface PageData {
  spendings: Spending[];
}

export const load: PageLoad = async (): Promise<PageData> => {
  if (browser) {
    const spendings = await getManySpendings({});
    return { spendings };
  }

  return { spendings: [] };
};
