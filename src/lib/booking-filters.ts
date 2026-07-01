export type DateFilter = "today" | "week" | "upcoming" | "past" | "all" | "custom";

export function dateRangeFor(filter: DateFilter, from?: string, to?: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  switch (filter) {
    case "today":
      return { gte: startOfToday, lt: endOfToday };
    case "week": {
      const end = new Date(startOfToday);
      end.setDate(end.getDate() + 7);
      return { gte: startOfToday, lt: end };
    }
    case "upcoming":
      return { gte: startOfToday };
    case "past":
      return { lt: startOfToday };
    case "custom": {
      const gte = from ? new Date(from + "T00:00:00") : undefined;
      const ltDate = to ? new Date(to + "T00:00:00") : undefined;
      const lt = ltDate ? new Date(ltDate.getTime() + 86400000) : undefined;
      return { gte, lt };
    }
    case "all":
    default:
      return {};
  }
}
