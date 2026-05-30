export default function OverdueModal({
  overdueTodos,
  moveUnfinishedToToday,
  deleteOverdueTodos,
  setShowOverdueModal,
}: {
  overdueTodos: { id: number; text: string }[];
  moveUnfinishedToToday: () => void;
  deleteOverdueTodos: () => void;
  setShowOverdueModal: (show: boolean) => void;
}) {
  return (
    <div className="overlay" onClick={() => setShowOverdueModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Unfinished tasks from past days</h3>

        <ul className="overdue-list">
          {overdueTodos.map((todo) => (
            <li className="overdue-item" key={todo.id}>
              {todo.text}
            </li>
          ))}
        </ul>

        <div className="modal-buttons">
          <button
            className="task-button move-all-to-today-button button"
            onClick={moveUnfinishedToToday}
          >
            Move all to today
          </button>

          <button
            className="modal-delete-button delete-button button"
            onClick={deleteOverdueTodos}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
