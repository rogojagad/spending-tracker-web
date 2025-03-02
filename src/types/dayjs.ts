import dayjs from "dayjs";
import { config } from "$lib/config";

declare module 'dayjs' {
    interface Dayjs {
        toFormattedDate(): string
    }
}

dayjs.prototype.toFormattedDate = function (): string {
    return this.format(config.dateFormat)
}

export default dayjs