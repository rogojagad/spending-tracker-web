import dayjs from "dayjs";
import type { SpendingCreatedAtRange } from "./interfaces";

const todayEndOfDayDateString = dayjs().endOf("day").toISOString();
export const dateRangeNameToDateValueMap = new Map<
  string,
  SpendingCreatedAtRange
>([
  [
    "Today",
    {
      fromInclusive: dayjs().startOf("day").toISOString(),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "Yesterday",
    {
      fromInclusive: dayjs().subtract(1, "day").startOf("day").toISOString(),
      toExclusive: dayjs().startOf("day").toISOString(),
    },
  ],
  [
    "Last 3 Days",
    {
      fromInclusive: dayjs().subtract(3, "day").startOf("day").toISOString(),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "Last 7 Days",
    {
      fromInclusive: dayjs().subtract(7, "day").startOf("day").toISOString(),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "This Week",
    {
      fromInclusive: dayjs().startOf("week").startOf("day").toISOString(),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "This Month",
    {
      fromInclusive: dayjs().startOf("month").startOf("day").toISOString(),
      toExclusive: todayEndOfDayDateString,
    },
  ],
]);
