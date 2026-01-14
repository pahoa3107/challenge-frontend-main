import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoStore } from '../useTodoStore';

describe('useTodoStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTodoStore.setState({ todos: [] });
  });

  it('should add a todo', () => {
    const todo = useTodoStore.getState().addTodo('New Task', 1, '2026-01-01');
    const todos = useTodoStore.getState().todos;

    expect(todos.length).toBe(1);
    expect(todos[0]).toEqual(todo);
    expect(todos[0].title).toBe('New Task');
    expect(todos[0].completed).toBe(false);
  });

  it('should update a todo', () => {
    const todo = useTodoStore.getState().addTodo('Old Title', 1);
    useTodoStore.getState().updateTodo(todo.id, { title: 'Updated Title' });
    
    const updatedTodo = useTodoStore.getState().todos.find(t => t.id === todo.id);
    expect(updatedTodo?.title).toBe('Updated Title');
  });

  it('should delete a todo', () => {
    const todo = useTodoStore.getState().addTodo('Task to delete', 1);
    expect(useTodoStore.getState().todos.length).toBe(1);
    
    useTodoStore.getState().deleteTodo(todo.id);
    expect(useTodoStore.getState().todos.length).toBe(0);
  });

  it('should toggle completion status', () => {
    const todo = useTodoStore.getState().addTodo('Check this', 1);
    expect(todo.completed).toBe(false);
    
    useTodoStore.getState().toggleComplete(todo.id);
    expect(useTodoStore.getState().todos[0].completed).toBe(true);
    
    useTodoStore.getState().toggleComplete(todo.id);
    expect(useTodoStore.getState().todos[0].completed).toBe(false);
  });

  it('should bulk delete todos', () => {
    const t1 = useTodoStore.getState().addTodo('Task 1', 1);
    const t2 = useTodoStore.getState().addTodo('Task 2', 1);
    const t3 = useTodoStore.getState().addTodo('Task 3', 1);
    
    useTodoStore.getState().bulkDelete([t1.id, t2.id]);
    
    const todos = useTodoStore.getState().todos;
    expect(todos.length).toBe(1);
    expect(todos[0].id).toBe(t3.id);
  });

  it('should bulk update status', () => {
    const t1 = useTodoStore.getState().addTodo('Task 1', 1);
    const t2 = useTodoStore.getState().addTodo('Task 2', 1);
    
    useTodoStore.getState().bulkUpdateStatus([t1.id, t2.id], true);
    
    const todos = useTodoStore.getState().todos;
    expect(todos.every(t => t.completed)).toBe(true);
  });
});
