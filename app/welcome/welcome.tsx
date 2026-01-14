import React, { useState, useMemo, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import Filter from "./components/Filter";
import Stats from "./components/Stats";
import Pagination from "./components/Pagination";
import { useUsers } from "~/hooks/useUsers";
import Header from "./components/Header";
import { useTodoActions } from "~/hooks/useTodoActions";
import type { Todo } from "~/types";
import EmptyState from "./components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { TODO_VIEW } from "~/enums/todo.enum";
import { useTodoFilters } from "./hooks/useTodoFilters";
import BulkActionBar from "./components/BulkActionBar";

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
    bulkDelete,
    bulkUpdateStatus,
    toggleComplete
  } = useTodoActions();

  const { data: users = [] } = useUsers();

  const {
    filterText,
    setFilterText,
    sortBy,
    setSortBy,
    selectedUser,
    setSelectedUser,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    view,
    setView,
    filteredTodos,
    paginatedTodos,
    totalPages,
    clearFilters,
    hasActiveFilters,
  } = useTodoFilters({ todos, showCompleted });

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isCrudFormOpen, setIsCrudFormOpen] = useState(false);
  const [highlightedTodoId, setHighlightedTodoId] = useState<number | null>(null);
  const [newTodoId, setNewTodoId] = useState<number | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

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
    clearFilters();
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

  const handleToggleSelect = (id: number) => {
    setSelectedTodos(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = paginatedTodos.map(t => t.id);
      setSelectedTodos(prev => Array.from(new Set([...prev, ...currentPageIds])));
    } else {
      const currentPageIds = paginatedTodos.map(t => t.id);
      setSelectedTodos(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const isAllSelected = paginatedTodos.length > 0 && paginatedTodos.every(t => selectedTodos.includes(t.id));

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTodos.length} tasks?`)) {
      bulkDelete(selectedTodos);
      setSelectedTodos([]);
    }
  };

  const handleBulkUpdateStatus = (completed: boolean) => {
    bulkUpdateStatus(selectedTodos, completed);
    setSelectedTodos([]);
  };

  useEffect(() => {
    if (highlightedTodoId !== null) {
      const timer = setTimeout(() => setHighlightedTodoId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedTodoId]);

  useEffect(() => {
    if (newTodoId !== null) {
      const timer = setTimeout(() => setNewTodoId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [newTodoId]);

  if (isLoading) return <LoadingState message="Loading tasks..." />;
  if (error) return <ErrorState error={error} />;
  if (todos.length === 0) return <EmptyState hasFilters={false} />;

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

        {stats && <Stats stats={stats} />}

        <Filter
          users={users}
          filterByText={{ value: filterText, onChange: setFilterText }}
          filterByUser={{ value: selectedUser, onChange: setSelectedUser }}
          filterByStatus={{ value: selectedStatus, onChange: setSelectedStatus }}
          sortBy={{ value: sortBy, onChange: setSortBy }}
          viewAction={{ view, setView }}
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Debug: {todos.length} todo loaded / Filtered: {filteredTodos.length} todos
          </span>
          <span className="text-primary font-medium">
            Show {paginatedTodos.length} / {filteredTodos.length} tasks
          </span>
        </div>

        <BulkActionBar
          selectedCount={selectedTodos.length}
          totalOnPage={paginatedTodos.length}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkDelete={handleBulkDelete}
        />

        {filteredTodos.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <>
            <div className={view === TODO_VIEW.GRID ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {paginatedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  user={users?.find((u) => u.id === todo.userId) || null}
                  todo={todo}
                  viewMode={view}
                  handleTodoClick={handleTodoClick}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTodo}
                  isSelected={selectedTodos.includes(todo.id)}
                  onToggleSelect={handleToggleSelect}
                  isHighlighted={highlightedTodoId === todo.id}
                  isNew={newTodoId === todo.id}
                />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList;
