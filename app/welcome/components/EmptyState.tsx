import { SearchX, Filter, Inbox } from "lucide-react";
import { Button } from "~/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No results found
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          There are no tasks that match the current filter. Try adjusting or clearing the filter to see all tasks.        </p>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Reset filter
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Inbox className="w-10 h-10 text-primary/50" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Chưa có task nào
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Bắt đầu bằng cách tạo task đầu tiên của bạn!
      </p>
    </div>
  );
}
