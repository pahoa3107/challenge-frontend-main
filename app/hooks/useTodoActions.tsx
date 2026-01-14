import { useEffect } from "react";
import { useTodos } from "./useTodos";
import { useTodoStore } from "../stores/useTodoStore";

export const useTodoActions = () => {
  const {
    todos,
    setTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodoStore();

  const {
    data,
    isLoading,
    error,
  } = useTodos();

  useEffect(() => {
    if (data?.todos) {
      setTodos(data.todos);
    }
  }, [data?.todos, setTodos]);

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
};
