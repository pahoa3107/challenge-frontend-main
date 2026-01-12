import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {start > 1 && (
        <>
          <Button
            variant={page === 1 ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="w-9 h-9 p-0"
          >
            1
          </Button>
          {start > 2 && <span className="px-2 text-muted-foreground">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={page === p ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 p-0 ${page === p ? "gradient-primary text-primary-foreground shadow-glow" : ""}`}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant={page === totalPages ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 p-0"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
