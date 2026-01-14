import { toast } from "sonner";
import { create } from "zustand";
import type { Todo } from "~/types";

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (title: string, userId: number, dueDate?: string) => Todo;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  toggleComplete: (id: number) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],

  setTodos: (todos) => set({ todos }),

  addTodo: (title, userId, dueDate) => {
    const newTodo: Todo = {
      id: Date.now(),
      userId,
      title: title.trim(),
      completed: false,
      dueDate,
    };

    set((state) => ({
      todos: [newTodo, ...state.todos],
    }));

    toast.success("Task has been created", {
      position: 'top-right',
    })

    return newTodo;
  },

  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    }));
    
    toast.success("Task has been updated", {
      position: 'top-right',
    });
  },

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  toggleComplete: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
}));

