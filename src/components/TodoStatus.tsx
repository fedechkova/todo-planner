export default function TodoStatus({
  hasTodos,
  allCompleted,
  activeCount,
}: {
  hasTodos: boolean;
  allCompleted: boolean;
  activeCount: number;
}) {
  return (
    <div
      className={
        !hasTodos
          ? "todo-status todo-status-empty"
          : allCompleted
            ? "todo-status todo-status-completed"
            : "todo-status"
      }
    >
      {!hasTodos
        ? "No tasks for this day"
        : allCompleted
          ? "All tasks completed!"
          : `${activeCount} active task${activeCount === 1 ? "" : "s"}`}
    </div>
  );
}
