import dayjs from "dayjs";
import type { DateRange } from "./interfaces";

const dateRangeValueFormat = "YYYY-MM-DD"
const tomorrowDate = dayjs().add(1, 'day').format(dateRangeValueFormat)

export const dateRangeNameToDateValueMap = new Map<string, DateRange>([
  [
    "Today",
    {
      fromInclusive: dayjs().format(dateRangeValueFormat),
      toExclusive: tomorrowDate,
    },
  ],
  [
    "Yesterday",
    {
      fromInclusive: dayjs().subtract(1, "day").format(dateRangeValueFormat),
      toExclusive: dayjs().subtract(1, "day").endOf("day").format(dateRangeValueFormat),
    },
  ],
  [
    "Last 3 Days",
    {
      fromInclusive: dayjs().subtract(2, "day").format(dateRangeValueFormat),
      toExclusive: tomorrowDate,
    },
  ],
  [
    "Last 7 Days",
    {
      fromInclusive: dayjs().subtract(6, "day").format(dateRangeValueFormat),
      toExclusive: tomorrowDate,
    },
  ],
  [
    "This Week",
    {
      fromInclusive: dayjs().startOf("week").format(dateRangeValueFormat),
      toExclusive: tomorrowDate,
    },
  ],
  [
    "This Month",
    {
      fromInclusive: dayjs().startOf("month").format(dateRangeValueFormat),
      toExclusive: tomorrowDate,
    },
  ],
]);

export const FORM_STATE = Object.freeze({
  NOT_SUBMITTED: "NOT_SUBMITTED",
  SUBMITTING: "SUBMITTING",
  SUBMIT_SUCCESS: "SUBMIT_SUCCESS",
  SUBMIT_ERROR: "SUBMIT_ERROR",
});
