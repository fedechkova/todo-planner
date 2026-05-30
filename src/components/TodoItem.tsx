import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import type { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  editingTodoId: number | null;
  editingText: string;
  setEditingText: (value: string) => void;
  setEditingTodoId: (id: number | null) => void;
  saveEditedTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

export default function TodoItem({
  todo,
  editingTodoId,
  editingText,
  setEditingText,
  setEditingTodoId,
  saveEditedTodo,
  toggleTodo,
  deleteTodo,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style: MotionStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    position: isDragging ? "relative" : "static",
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      className={`todo-item ${isDragging ? "todo-item-dragging" : ""}`}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="checkbox-input"
        />
        <span className="custom-checkbox"></span>
      </label>

      {editingTodoId === todo.id ? (
        <input
          className="edit-input"
          value={editingText}
          autoFocus
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() => saveEditedTodo(todo.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEditedTodo(todo.id);

            if (e.key === "Escape") {
              setEditingTodoId(null);
              setEditingText("");
            }
          }}
        />
      ) : (
        <span
          className={`todo-text ${todo.completed ? "completed" : ""}`}
          onDoubleClick={() => {
            setEditingTodoId(todo.id);
            setEditingText(todo.text);
          }}
        >
          {todo.text}
        </span>
      )}

      <div className="todo-actions">
        <button
          className="edit-button"
          onClick={() => {
            setEditingTodoId(todo.id);
            setEditingText(todo.text);
          }}
        >
          ✏️
        </button>
        <button
          className="delete-button button"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </button>
        <button
          ref={setActivatorNodeRef}
          className="drag-handle"
          type="button"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
      </div>
    </motion.li>
  );
}