export type UsageLevel = "safe" | "warning" | "exceeded";

const colorByUsageLevel: Record<UsageLevel, string> = {
    safe: "#38a169",
    warning: "#d69e2e",
    exceeded: "#a13838",
};

export const getUsageLevel = (usagePercentage: number): UsageLevel => {
    return usagePercentage < 60
        ? "safe"
        : usagePercentage >= 100
            ? "exceeded"
            : "warning";
}

export const getColorByUsagePercentage = (usagePercentage: number): string => {
    const usageLevel: UsageLevel = getUsageLevel(usagePercentage)

    return colorByUsageLevel[usageLevel];
};