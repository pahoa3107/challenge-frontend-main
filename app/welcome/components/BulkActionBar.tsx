import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { CheckCircle2, Clock, Trash2 } from "lucide-react";

interface BulkActionBarProps {
    selectedCount: number;
    totalOnPage: number;
    isAllSelected: boolean;
    onSelectAll: (checked: boolean) => void;
    onBulkUpdateStatus: (completed: boolean) => void;
    onBulkDelete: () => void;
}

export default function BulkActionBar({
    selectedCount,
    totalOnPage,
    isAllSelected,
    onSelectAll,
    onBulkUpdateStatus,
    onBulkDelete,
}: BulkActionBarProps) {
    return (
        <div className="flex items-center justify-between py-2 px-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={isAllSelected}
                        onChange={(e) => onSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                        Select Page ({totalOnPage})
                    </label>
                </div>
                {selectedCount > 0 && (
                    <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                        {selectedCount} selected
                    </span>
                )}
            </div>

            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBulkUpdateStatus(true)}
                        className="h-8 text-xs gap-1.5 border-success/30 hover:bg-success/10 hover:text-success"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBulkUpdateStatus(false)}
                        className="h-8 text-xs gap-1.5 border-warning/30 hover:bg-warning/10 hover:text-warning"
                    >
                        <Clock className="w-3.5 h-3.5" />
                        In Progress
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBulkDelete}
                        className="h-8 text-xs gap-1.5 border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
