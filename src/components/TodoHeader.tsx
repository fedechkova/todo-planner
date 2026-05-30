export default function TodoHeader({ inputValue, setInputValue, addTodo }: {
  inputValue: string;
  setInputValue: (value: string) => void;
  addTodo: () => void;
}) {
  return (
    <div className="todo-header">
      <h1 className="todo-title">Todo List</h1>
      <div className="task-form">
        <input
          className="task-input"
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTodo();
            }
          }}
        />
        <button
          className="task-button-header task-button button"
          type="button"
          onClick={addTodo}
          disabled={inputValue.trim() === ""}
        >
          Add
        </button>
      </div>
    </div>
  );
}