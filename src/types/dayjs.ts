import dayjs from "dayjs";
import { config } from "$lib/config";

declare module 'dayjs' {
    interface Dayjs {
        formatWithDayAndMonth(): string
        formatWithMonthOnly(): string
    }
}

dayjs.prototype.formatWithDayAndMonth = function (): string {
    return this.format(config.dateFormat.dayAndMonth)
}

dayjs.prototype.formatWithMonthOnly = function (): string {
    return this.format(config.dateFormat.monthOnly)
}

export default dayjs