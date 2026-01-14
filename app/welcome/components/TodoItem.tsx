import { motion } from "framer-motion";
import type { Todo, User } from "../../types";
import { cn } from "~/lib/utils";
import { CheckCircle2, Circle, UserIcon, Calendar, AlertCircle } from "lucide-react";
interface TodoItemProps {
  todo: Todo;
  user: User | null;
  handleTodoClick?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  viewMode: string;
  isHighlighted?: boolean;
  isNew?: boolean;
}

export default function TodoItem({ todo, user, viewMode, handleTodoClick, onToggleComplete, isHighlighted = false, isNew = false }: TodoItemProps) {
  const isGrid = viewMode === "grid";

  const getDueDateStatus = () => {
    if (!todo.dueDate || todo.completed) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'near-due';
    return 'normal';
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const dueDateStatus = getDueDateStatus();
  const isNearDue = dueDateStatus === 'near-due';
  const isOverdue = dueDateStatus === 'overdue';

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(todo.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: isHighlighted ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleTodoClick?.(todo.id)}
      className={cn(
        "group bg-card rounded-xl border shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer",
        isHighlighted
          ? "border-primary shadow-lg ring-4 ring-primary/40 bg-primary/5"
          : isNearDue
            ? "border-orange-400 shadow-lg ring-2 ring-orange-400/30 bg-orange-50/50 dark:bg-orange-950/20"
            : "border-border/50",
        isGrid ? "p-4" : "p-4 flex items-center gap-4"
      )}
    >
      <button
        onClick={handleToggleClick}
        className={cn(
          "shrink-0 cursor-pointer hover:scale-110 transition-transform",
          isGrid ? "mb-3" : ""
        )}
      >
        {todo.completed ? (
          <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
            <Circle className="w-3 h-3 text-transparent" />
          </div>
        )}
      </button>

      <div className={cn("flex-1 min-w-0", isGrid ? "" : "")}>
        <div className="flex items-center gap-2 mb-1">
          <p
            className={cn(
              "text-sm font-medium leading-relaxed",
              todo.completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            )}
          >
            {todo.title}
          </p>
          {isNew && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
            >
              New
            </motion.span>
          )}
        </div>

        <div className={cn("flex items-center gap-2 mt-2", isGrid ? "" : "")}>
          {user && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-accent-foreground" />
              </div>
              <span className="truncate max-w-30">{user.name}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground/60">#{todo.id}</span>
          {todo.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-600 dark:text-red-400 font-semibold" :
                isNearDue ? "text-orange-600 dark:text-orange-400 font-medium" :
                  "text-muted-foreground"
            )}>
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>{formatDueDate(todo.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className={cn("shrink-0", isGrid ? "mt-3" : "")}>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
            isOverdue
              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
              : todo.completed
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
          )}
        >
          {isOverdue ? "Overdue" : todo.completed ? "Completed" : "In Progress"}
        </span>
      </div>
    </motion.div>
  );
};
