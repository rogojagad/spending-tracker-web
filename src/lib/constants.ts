import dayjs from "dayjs";
import type { DateRange } from "./interfaces";

const todayEndOfDayDateString = dayjs().endOf("day").toISOString();
const dateRangeValueFormat = "YYYY-MM-DD"

export const dateRangeNameToDateValueMap = new Map<string, DateRange>([
  [
    "Today",
    {
      fromInclusive: dayjs().format(dateRangeValueFormat),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "Yesterday",
    {
      fromInclusive: dayjs().subtract(1, "day").format(dateRangeValueFormat),
      toExclusive: dayjs().subtract(1, "day").endOf("day").toISOString(),
    },
  ],
  [
    "Last 3 Days",
    {
      fromInclusive: dayjs().subtract(2, "day").format(dateRangeValueFormat),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "Last 7 Days",
    {
      fromInclusive: dayjs().subtract(6, "day").format(dateRangeValueFormat),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "This Week",
    {
      fromInclusive: dayjs().startOf("week").format(dateRangeValueFormat),
      toExclusive: todayEndOfDayDateString,
    },
  ],
  [
    "This Month",
    {
      fromInclusive: dayjs().startOf("month").format(dateRangeValueFormat),
      toExclusive: todayEndOfDayDateString,
    },
  ],
]);

export const FORM_STATE = Object.freeze({
  NOT_SUBMITTED: "NOT_SUBMITTED",
  SUBMITTING: "SUBMITTING",
  SUBMIT_SUCCESS: "SUBMIT_SUCCESS",
  SUBMIT_ERROR: "SUBMIT_ERROR",
});
