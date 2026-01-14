import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem';
import { TODO_VIEW } from '~/enums/todo.enum';

const mockTodo = {
    id: 1,
    userId: 1,
    title: 'Test Task',
    completed: false,
    dueDate: '2026-01-01'
};

const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
};

describe('TodoItem', () => {
    it('should render todo details correctly', () => {
        render(
            <TodoItem
                todo={mockTodo}
                user={mockUser}
                viewMode={TODO_VIEW.LIST}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('should call onToggleComplete when status button is clicked', () => {
        const onToggleComplete = vi.fn();
        render(
            <TodoItem
                todo={mockTodo}
                user={mockUser}
                viewMode={TODO_VIEW.LIST}
                onToggleComplete={onToggleComplete}
            />
        );

        const toggleButton = screen.getByTitle('Mark as completed');
        fireEvent.click(toggleButton);

        expect(onToggleComplete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should call onDelete when delete button is clicked and confirmed', () => {
        const onDelete = vi.fn();
        // mock window.confirm is already handled in setup or I can mock it here
        window.confirm = vi.fn(() => true);

        render(
            <TodoItem
                todo={mockTodo}
                user={mockUser}
                viewMode={TODO_VIEW.LIST}
                onDelete={onDelete}
            />
        );

        const deleteButton = screen.getByTitle('Delete task');
        fireEvent.click(deleteButton);

        expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should call handleTodoClick when card is clicked', () => {
        const handleTodoClick = vi.fn();
        render(
            <TodoItem
                todo={mockTodo}
                user={mockUser}
                viewMode={TODO_VIEW.LIST}
                handleTodoClick={handleTodoClick}
            />
        );

        const card = screen.getByText('Test Task').closest('div[class*="group"]');
        if (card) fireEvent.click(card);

        expect(handleTodoClick).toHaveBeenCalledWith(mockTodo.id);
    });

    it('should call onToggleSelect when checkbox is clicked', () => {
        const onToggleSelect = vi.fn();
        render(
            <TodoItem
                todo={mockTodo}
                user={mockUser}
                viewMode={TODO_VIEW.LIST}
                onToggleSelect={onToggleSelect}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(onToggleSelect).toHaveBeenCalledWith(mockTodo.id);
    });
});
