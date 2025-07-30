import dayjs from "dayjs";

const dayMonthYearFormat = "dddd, DD MMM YYYY"

export function formatAppliedFilterHint(categoryName: string, sourceName: string, fromInclusive: string, toExclusive: string): string {
    return `Filtered for category <strong>${
      categoryName
    }</strong>
      from source
      <strong>${sourceName}</strong>
      from <strong>${dayjs(fromInclusive).format(dayMonthYearFormat)}</strong> until
      <strong>${dayjs(toExclusive)
        .format(dayMonthYearFormat)}</strong>`
}