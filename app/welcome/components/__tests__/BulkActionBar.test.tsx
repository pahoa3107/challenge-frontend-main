import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BulkActionBar from '../BulkActionBar';

describe('BulkActionBar', () => {
    const defaultProps = {
        selectedCount: 0,
        totalOnPage: 10,
        isAllSelected: false,
        onSelectAll: vi.fn(),
        onBulkUpdateStatus: vi.fn(),
        onBulkDelete: vi.fn(),
    };

    it('should render selection info but no action buttons when count is 0', () => {
        render(<BulkActionBar {...defaultProps} />);

        expect(screen.getByText('Select Page (10)')).toBeInTheDocument();
        expect(screen.queryByText('Complete')).not.toBeInTheDocument();
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('should render action buttons when selectedCount > 0', () => {
        render(<BulkActionBar {...defaultProps} selectedCount={2} />);

        expect(screen.getByText('2 selected')).toBeInTheDocument();
        expect(screen.getByText('Complete')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should call onBulkUpdateStatus when Complete button is clicked', () => {
        const onBulkUpdateStatus = vi.fn();
        render(<BulkActionBar {...defaultProps} selectedCount={2} onBulkUpdateStatus={onBulkUpdateStatus} />);

        fireEvent.click(screen.getByText('Complete'));
        expect(onBulkUpdateStatus).toHaveBeenCalledWith(true);
    });

    it('should call onBulkDelete when Delete button is clicked', () => {
        const onBulkDelete = vi.fn();
        render(<BulkActionBar {...defaultProps} selectedCount={2} onBulkDelete={onBulkDelete} />);

        fireEvent.click(screen.getByText('Delete'));
        expect(onBulkDelete).toHaveBeenCalled();
    });

    it('should call onSelectAll when checkbox is clicked', () => {
        const onSelectAll = vi.fn();
        render(<BulkActionBar {...defaultProps} onSelectAll={onSelectAll} />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onSelectAll).toHaveBeenCalledWith(true);
    });
});
