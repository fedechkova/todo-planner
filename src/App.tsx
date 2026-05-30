import { useEffect, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import "./App.css";

import type { Todo } from "./types/Todo.ts";

import { getDateKey, getWeekDays } from "./utils/Date.ts";
import { getSavedTodos, saveTodos } from "./utils/storage";

import TodoItem from "./components/TodoItem";
import Calendar from "./components/Calendar";
import TodoHeader from "./components/TodoHeader";
import TodoStatus from "./components/TodoStatus";
import OverdueModal from "./components/OverdueModal";

function App() {
  const [todos, setTodos] = useState<Todo[]>(getSavedTodos());
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()));
  const [weekOffset, setWeekOffset] = useState(0);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  /* region derived values */

  const today = getDateKey(new Date());
  
  const days = getWeekDays(weekOffset);

  const overdueTodos = todos.filter(
    (todo) => !todo.completed && todo.date < today,
  );

  const showOverdue = overdueTodos.length > 0 || showOverdueModal;


  const todosForSelectedDate = todos.filter(
    (todo) => todo.date === selectedDate,
  );

  const sortedTodos = [...todosForSelectedDate].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    return (b.order ?? b.id) - (a.order ?? a.id);
  });

  const hasTodos = sortedTodos.length > 0;
  const activeCount = sortedTodos.filter((todo) => !todo.completed).length;
  const allCompleted = hasTodos && activeCount === 0;

  /* region Effects */

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  /* region Handlers */

  const addTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      date: selectedDate,
      order: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      }),
    );
  };

  const saveEditedTodo = (id: number) => {
    if (editingText.trim() === "") {
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo,
      ),
    );

    setEditingTodoId(null);
    setEditingText("");
  };

  const deleteOverdueTodos = () => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => !(!todo.completed && todo.date < today)),
    );

    setShowOverdueModal(false);
  };

  const moveUnfinishedToToday = () => {
    setTodos(
      todos.map((todo) =>
        !todo.completed && todo.date < today ? { ...todo, date: today } : todo,
      ),
    );

    setSelectedDate(today);
    setShowOverdueModal(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTodos((prevTodos) => {
      const selectedTodos = prevTodos
        .filter((todo) => todo.date === selectedDate)
        .sort((a, b) => {
          if (a.completed !== b.completed) {
            return Number(a.completed) - Number(b.completed);
          }

          return (a.order ?? a.id) - (b.order ?? b.id);
        });

      const oldIndex = selectedTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = selectedTodos.findIndex((todo) => todo.id === over.id);

      const reordered = arrayMove(selectedTodos, oldIndex, newIndex).map(
        (todo, index) => ({
          ...todo,
          order: index,
        }),
      );

      return prevTodos.map((todo) => {
        const updatedTodo = reordered.find((item) => item.id === todo.id);
        return updatedTodo ?? todo;
      });
    });
  };

  return (
    <div className="background">
      <div className="app-layout">
        <Calendar
          days={days}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
        />

        <div className="todo-card">
          <TodoHeader
            inputValue={inputValue}
            setInputValue={setInputValue}
            addTodo={addTodo}
          />

          <TodoStatus
            hasTodos={hasTodos}
            allCompleted={allCompleted}
            activeCount={activeCount}
          />

          <div className="todo-list-container">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedTodos.map((todo) => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="todo-list">
                  {sortedTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      editingTodoId={editingTodoId}
                      editingText={editingText}
                      setEditingText={setEditingText}
                      setEditingTodoId={setEditingTodoId}
                      saveEditedTodo={saveEditedTodo}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <p className="todo-footer">Plan calmly. Finish confidently.</p>

      {showOverdue && overdueTodos.length > 0 && (
        <OverdueModal
          overdueTodos={overdueTodos}
          moveUnfinishedToToday={moveUnfinishedToToday}
          deleteOverdueTodos={deleteOverdueTodos}
          setShowOverdueModal={setShowOverdueModal}
        />
      )}
    </div>
  );
}

export default App;
