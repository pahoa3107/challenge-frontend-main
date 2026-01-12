import React, { useState, useMemo } from "react";
import { TodoItem } from "./components/TodoItem";
import { Filter } from "./components/Filter";
import { Stats } from "./components/Stats";
import { Pagination } from "./components/Pagination";
import { useTodos } from "~/hooks/useTodos";
import { useUsers } from "~/hooks/useUsers";

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
    const userCount = new Set(todos.map((t) => t.userId)).size;

    return {
      completed,
      userCount,
      total: todos.length,
    };
  }, [todos]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  if (todos.length === 0) return <div>No todos found</div>;

  return (
    <div>
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
      />

      {stats && <Stats stats={stats} />}

      {paginatedTodos.map((todo) => (
        <TodoItem
          user={users[todo.userId]}
          todo={todo}
          // handleTodoClick={handleTodoClick}
        />
      ))}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Debug: {todos.length} todos loaded</p>
        <p>Filtered: {filteredTodos.length} todos</p>
      </div>
    </div>
  );
};

export default TodoList;
