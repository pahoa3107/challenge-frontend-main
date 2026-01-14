import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import type { Todo } from "~/types";
import {
  TODO_STATUS,
  type TODO_STATUS as TYPE_TODO_STATUS,
  TODO_VIEW,
  type TODO_VIEW as TYPE_TODO_VIEW,
  TODO_SORT,
  type TODO_SORT as TYPE_TODO_SORT
} from "~/enums/todo.enum";

interface UseTodoFiltersProps {
  todos: Todo[];
  showCompleted?: boolean;
}

export const useTodoFilters = ({ todos, showCompleted = false }: UseTodoFiltersProps) => {
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
  const [selectedStatus, setSelectedStatus] = useState<TYPE_TODO_STATUS>(
    (searchParams.get("status") as TYPE_TODO_STATUS) || TODO_STATUS.ALL
  );
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [view, setView] = useState<TYPE_TODO_VIEW>(
    (searchParams.get("view") as TYPE_TODO_VIEW) || TODO_VIEW.LIST
  );

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

  const filteredTodos = useMemo(() => {
    return (todos || []).filter((todo) => {
      if (showCompleted && !todo.completed) return false;
      if (filterText && !todo.title.toLowerCase().includes(filterText.toLowerCase())) return false;
      if (selectedUser && todo.userId !== selectedUser) return false;
      if (selectedStatus === TODO_STATUS.COMPLETED && !todo.completed) return false;
      if (selectedStatus === TODO_STATUS.IN_PROGRESS) {
        if (todo.completed) return false;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo?.dueDate || "");
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < now) return false;
      };
      if (selectedStatus === TODO_STATUS.OVERDUE) {
        if (todo.completed || !todo.dueDate) return false;

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo?.dueDate || "");
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate >= now) return false;
      }
      return true;
    });
  }, [todos, showCompleted, filterText, selectedUser, selectedStatus]);

  const sortedTodos = useMemo(() => {
    if (sortBy === TODO_SORT.DEFAULT) return filteredTodos;
    return [...filteredTodos].sort((a, b) => {
      if (sortBy === TODO_SORT.TITLE) {
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id;
    });
  }, [sortBy, filteredTodos]);

  const totalPages = Math.ceil(sortedTodos.length / 10);
  const paginatedTodos = sortedTodos.slice((page - 1) * 10, page * 10);

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

  return {
    filterText,
    setFilterText: handleSetFilterText,
    sortBy,
    setSortBy: handleSetSortBy,
    selectedUser,
    setSelectedUser: handleSetSelectedUser,
    selectedStatus,
    setSelectedStatus: handleSetSelectedStatus,
    page,
    setPage,
    view,
    setView,
    filteredTodos,
    paginatedTodos,
    totalPages,
    clearFilters,
    hasActiveFilters,
  };
};
