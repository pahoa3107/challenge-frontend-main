import React, { useState, useMemo, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import Filter from "./components/Filter";
import Stats from "./components/Stats";
import Pagination from "./components/Pagination";
import { useUsers } from "~/hooks/useUsers";
import Header from "./components/Header";
import { useTodoActions } from "~/hooks/useTodoActions";
import { useSearchParams } from "react-router";
import type { Todo } from "~/types";
import EmptyState from "./components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  TODO_STATUS,
  type TODO_STATUS as TYPE_TODO_STATUS,
  TODO_VIEW,
  type TODO_VIEW as TYPE_TODO_VIEW,
  TODO_SORT,
  type TODO_SORT as TYPE_TODO_SORT
} from "~/enums/todo.enum";

const TodoList: React.FC<{ showCompleted?: boolean }> = ({
  showCompleted = false,
}) => {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete
  } = useTodoActions();

  const { data: users = [] } = useUsers();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterText, setFilterText] = useState(
    () => searchParams.get("q") || ""
  );
  const [sortBy, setSortBy] = useState<TYPE_TODO_SORT>(
    (searchParams.get("sort") as TYPE_TODO_SORT) || TODO_SORT.DEFAULT
  );
  const [selectedUser, setSelectedUser] = useState<number | null>(() => {
    const user = searchParams.get("user");
    return user ? Number(user) : null;
  });
  const [selectedStatus, setSelectedStatus] = useState<
    TYPE_TODO_STATUS
  >((searchParams.get("status") as TYPE_TODO_STATUS) || TODO_STATUS.ALL);
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [view, setView] = useState<TYPE_TODO_VIEW>(
    (searchParams.get("view") as TYPE_TODO_VIEW) || TODO_VIEW.LIST
  );
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isCrudFormOpen, setIsCrudFormOpen] = useState(false);
  const [highlightedTodoId, setHighlightedTodoId] = useState<number | null>(null);
  const [newTodoId, setNewTodoId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();

    const setOrDelete = (key: string, value: string | null, defaultValue: string | null = null) => {
      if (!value || value === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    };

    setOrDelete("q", filterText || null, "");
    setOrDelete("sort", sortBy, TODO_SORT.DEFAULT);
    setOrDelete("user", selectedUser ? String(selectedUser) : null);
    setOrDelete("status", selectedStatus, TODO_STATUS.ALL);
    setOrDelete("view", view, TODO_VIEW.LIST);
    setOrDelete("page", page > 1 ? String(page) : null, null);

    setSearchParams(params, { replace: true });
  }, [filterText, sortBy, selectedUser, selectedStatus, view, page, setSearchParams]);

  const filteredTodos = todos?.filter((todo) => {
    if (showCompleted && !todo.completed) return false;
    if (filterText && !todo.title.includes(filterText)) return false;
    if (selectedUser && todo.userId !== selectedUser) return false;
    if (selectedStatus === TODO_STATUS.COMPLETED && !todo.completed) return false;
    if (selectedStatus === TODO_STATUS.IN_PROGRESS && todo.completed) return false;
    if (selectedStatus === TODO_STATUS.OVERDUE && (todo.completed || !todo?.dueDate)) return false;
    return true;
  });

  const totalPages = useMemo(() => Math.ceil(filteredTodos?.length / 10), [filteredTodos])

  const sortedTodos = useMemo(() => {
    if (sortBy === TODO_SORT.DEFAULT) return filteredTodos;
    return [...filteredTodos].sort((a, b) => {
      if (sortBy === TODO_SORT.TITLE) {
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id;
    });
  }, [sortBy, filteredTodos]);

  const paginatedTodos = sortedTodos.slice((page - 1) * 10, page * 10);

  const stats = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const inprogress = todos.filter((t) => !t.completed).length;
    const userCount = new Set(todos.map((t) => t.userId)).size;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const overdue = todos.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < now;
    }).length;

    return {
      completed,
      userCount,
      total: todos.length,
      inprogress,
      overdue,
    };
  }, [todos]);

  const handleTodoClick = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setIsCrudFormOpen(true);
    }
  };

  const handleAddTodo = (title: string, userId: number, dueDate?: string) => {
    const newTodo = addTodo(title, userId, dueDate);
    setIsCrudFormOpen(false);
    setEditingTodo(null);
    setFilterText("");
    setSelectedUser(null);
    setSelectedStatus(TODO_STATUS.ALL);
    setSortBy(TODO_SORT.DEFAULT);
    setPage(1);
    if (newTodo) {
      setHighlightedTodoId(newTodo.id);
      setNewTodoId(newTodo.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTodo = (id: number, updates: Partial<Todo>) => {
    updateTodo(id, updates);
    setIsCrudFormOpen(false);
    setEditingTodo(null);
    setHighlightedTodoId(id);
  };

  const handleCrudFormOpenChange = (open: boolean) => {
    setIsCrudFormOpen(open);
    if (!open) {
      setEditingTodo(null);
    }
  };

  const handleSetFilterText = (value: string) => {
    setPage(1);
    setFilterText(value);
  };

  const handleSetSelectedUser = (value: number | null) => {
    setPage(1);
    setSelectedUser(value);
  };

  const handleSetSelectedStatus = (value: TYPE_TODO_STATUS) => {
    setPage(1);
    setSelectedStatus(value);
  };

  const handleSetSortBy = (value: TYPE_TODO_SORT) => {
    setPage(1);
    setSortBy(value);
  };

  const clearFilters = () => {
    setFilterText("");
    setSelectedUser(null);
    setSelectedStatus(TODO_STATUS.ALL);
    setSortBy(TODO_SORT.DEFAULT);
    setPage(1);
  };

  const hasActiveFilters = filterText !== "" || selectedUser !== null || selectedStatus !== TODO_STATUS.ALL || sortBy !== TODO_SORT.DEFAULT;

  useEffect(() => {
    if (highlightedTodoId !== null) {
      const timer = setTimeout(() => {
        setHighlightedTodoId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTodoId]);

  useEffect(() => {
    if (newTodoId !== null) {
      const timer = setTimeout(() => {
        setNewTodoId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newTodoId]);

  if (isLoading) return <LoadingState message="Loading tasks..." />;
  if (error) return <ErrorState error={error} />;
  if (todos.length === 0) return (
    <EmptyState
      hasFilters={false}
    />
  );

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <Header
          users={users}
          todos={todos}
          onAdd={handleAddTodo}
          onUpdate={handleUpdateTodo}
          editingTodo={editingTodo}
          open={isCrudFormOpen}
          onOpenChange={handleCrudFormOpenChange}
        />

        {/* Stats */}
        {stats && <Stats stats={stats} />}

        {/* Filter */}
        <Filter
          users={Object.values(users)}
          filterByText={{
            value: filterText,
            onChange: handleSetFilterText,
          }}
          filterByUser={{
            value: selectedUser,
            onChange: handleSetSelectedUser,
          }}
          filterByStatus={{
            value: selectedStatus,
            onChange: handleSetSelectedStatus,
          }}
          sortBy={{
            value: sortBy,
            onChange: handleSetSortBy,
          }}
          viewAction={{ view, setView }}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Debug: {todos.length} todo loaded / Filtered: {filteredTodos.length}{" "}
            todos
          </span>
          <span className="text-primary font-medium">
            Show {paginatedTodos.length} / {filteredTodos.length} tasks
          </span>
        </div>

        {/* Todo Items */}
        {filteredTodos.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <>
            <div
              className={
                view === TODO_VIEW.GRID
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {paginatedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  user={users?.find((u) => u.id === todo.userId) || null}
                  todo={todo}
                  viewMode={view}
                  handleTodoClick={handleTodoClick}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTodo}
                  isHighlighted={highlightedTodoId === todo.id}
                  isNew={newTodoId === todo.id}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;
