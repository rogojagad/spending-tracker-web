import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const JAKARTA_TIMEZONE = "Asia/Jakarta";

export function formatJakartaDay(isoDate: string): string {
  return dayjs(isoDate).tz(JAKARTA_TIMEZONE).format("D MMM YYYY");
}

export function formatJakartaMonthKey(isoDate: string): string {
  return dayjs(isoDate).tz(JAKARTA_TIMEZONE).format("YYYY-MM");
}

export function formatJakartaMonthLabel(isoDate: string): string {
  return dayjs(isoDate).tz(JAKARTA_TIMEZONE).format("MMM YYYY");
}
