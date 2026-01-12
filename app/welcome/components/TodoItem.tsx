import styled from "styled-components";
import type { Todo, User } from "../../types";

interface Props {
  todo: Todo;
  user?: User;
  handleTodoClick?: (id: number) => void;
}

export const TodoItem = ({ todo, user, handleTodoClick }: Props) => {
  const TodoItem = styled.div<{ completed: boolean }>`
    padding: 10px;
    margin: 5px 0;
    background: ${({ completed }) => (completed ? "#d4edda" : "#f8d7da")};
    border: 2px solid ${({ completed }) => (completed ? "#c3e6cb" : "#f5c6cb")};
    cursor: pointer;

    &:hover {
      background: ${({ completed }) => (completed ? "#c3e6cb" : "#f5c6cb")};
    }
  `;
  return (
    <TodoItem
      key={todo.id}
      completed={todo.completed}
      onClick={() => handleTodoClick?.(todo.id)}
    >
      <strong>{todo.title}</strong>
      <span> - User: {user?.name || "Unknown"}</span>
      <span> - {todo.completed ? "✅" : "❌"}</span>
    </TodoItem>
  );
};
