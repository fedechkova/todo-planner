export default function Calendar({
  days,
  selectedDate,
  setSelectedDate,
  weekOffset,
  setWeekOffset,
}: {
  days: { date: string; weekday: string; dayNumber: number }[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
}) {
  return (
    <div className="calendar-strip">
      <button
        className="calendar-button calendar-prev-button"
        onClick={() => setWeekOffset(weekOffset - 1)}
      >
        <span className="arrow arrow-prev"></span>
      </button>

      {days.map((day) => (
        <button
          key={day.date}
          className={
            selectedDate === day.date ? "day-button active-day" : "day-button"
          }
          onClick={() => setSelectedDate(day.date)}
        >
          <span>{day.weekday}</span>
          <strong>{day.dayNumber}</strong>
        </button>
      ))}

      <button
        className="calendar-button calendar-next-button"
        onClick={() => setWeekOffset(weekOffset + 1)}
      >
        <span className="arrow arrow-next"></span>
      </button>
    </div>
  );
}
