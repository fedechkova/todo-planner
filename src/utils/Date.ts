import type { CalendarDay } from "../types/CalendarDay";

export const getDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const getWeekDays = (weekOffset: number): CalendarDay[] => {
  const today = new Date();
  today.setDate(today.getDate() + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      date: getDateKey(date),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
    };
  });
};