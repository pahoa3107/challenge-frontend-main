import React, { useState, useMemo } from "react";
import { TodoItem } from "./components/TodoItem";
import { Filter } from "./components/Filter";
import { Stats } from "./components/Stats";
import Pagination from "./components/Pagination";
import { useTodos } from "~/hooks/useTodos";
import { useUsers } from "~/hooks/useUsers";
import Header from "./components/Header";

const TodoList: React.FC<{ showCompleted?: boolean }> = ({
  showCompleted = false,
}) => {
  const {
    data: { todos = [], totalPages = 0 } = {},
    isLoading,
    error,
  } = useTodos();

  const { data: users = [] } = useUsers();

  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "title">("id");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");

  const filteredTodos = todos?.filter((todo) => {
    if (showCompleted && !todo.completed) return false;
    if (filterText && !todo.title.includes(filterText)) return false;
    if (selectedUser && todo.userId !== selectedUser) return false;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return a.id - b.id;
  });

  const paginatedTodos = sortedTodos.slice((page - 1) * 10, page * 10);

  const stats = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const inprogress = todos.filter((t) => !t.completed).length;
    const userCount = new Set(todos.map((t) => t.userId)).size;

    return {
      completed,
      userCount,
      total: todos.length,
      inprogress,
    };
  }, [todos]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  if (todos.length === 0) return <div>No todos found</div>;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <Header users={users} />

        {/* Stats */}
        {stats && <Stats stats={stats} />}

        {/* Filter */}
        <Filter
          users={Object.values(users)}
          filterByText={{
            value: filterText,
            onChange: setFilterText,
          }}
          filterByUser={{
            value: selectedUser,
            onChange: setSelectedUser,
          }}
          sortBy={{
            value: sortBy,
            onChange: setSortBy,
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
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {paginatedTodos.map((todo) => (
            <TodoItem
              user={users?.find((u) => u.id === todo.userId) || null}
              todo={todo}
              viewMode={view}
            />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default TodoList;
