import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoFilters } from '../useTodoFilters';
import { TODO_STATUS, TODO_SORT } from '../../../enums/todo.enum';
import { MemoryRouter } from 'react-router';
import React from 'react';

// Wrapper for react-router hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const mockTodos = [
  { id: 1, userId: 1, title: 'Alpha', completed: false, dueDate: '2026-12-31' },
  { id: 2, userId: 2, title: 'Beta', completed: true, dueDate: '2026-01-01' },
  { id: 3, userId: 1, title: 'Gamma', completed: false, dueDate: '2020-01-01' }, // Overdue
];

describe('useTodoFilters', () => {
  it('should filter todos by text search', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setFilterText('alpha');
    });
    
    expect(result.current.filteredTodos.length).toBe(1);
    expect(result.current.filteredTodos[0].title).toBe('Alpha');
  });

  it('should filter todos by user', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setSelectedUser(1);
    });
    
    expect(result.current.filteredTodos.length).toBe(2);
    expect(result.current.filteredTodos.every(t => t.userId === 1)).toBe(true);
  });

  it('should filter todos by status (Completed)', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setSelectedStatus(TODO_STATUS.COMPLETED);
    });
    
    expect(result.current.filteredTodos.length).toBe(1);
    expect(result.current.filteredTodos[0].completed).toBe(true);
  });

  it('should filter todos by status (Overdue)', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setSelectedStatus(TODO_STATUS.OVERDUE);
    });
    
    expect(result.current.filteredTodos.length).toBe(1);
    expect(result.current.filteredTodos[0].title).toBe('Gamma');
  });

  it('should sort todos by title', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setSortBy(TODO_SORT.TITLE);
    });
    
    expect(result.current.paginatedTodos[0].title).toBe('Alpha');
    expect(result.current.paginatedTodos[1].title).toBe('Beta');
    expect(result.current.paginatedTodos[2].title).toBe('Gamma');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useTodoFilters({ todos: mockTodos }), { wrapper });
    
    act(() => {
      result.current.setFilterText('abc');
      result.current.setSelectedUser(1);
    });
    
    expect(result.current.hasActiveFilters).toBe(true);
    
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filterText).toBe('');
    expect(result.current.selectedUser).toBeNull();
  });
});
