import { motion } from "framer-motion";
import type { Todo, User } from "../../types";
import { cn } from "~/lib/utils";
import { CheckCircle2, Circle, UserIcon } from "lucide-react";
interface Props {
  todo: Todo;
  user: User | null;
  handleTodoClick?: (id: number) => void;
  viewMode: string;
}

export const TodoItem = ({ todo, user, viewMode }: Props) => {
  const isGrid = viewMode === "grid";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group bg-card rounded-xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-200",
        isGrid ? "p-4" : "p-4 flex items-center gap-4"
      )}
    >
      <button
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
        </div>
      </div>

      <div className={cn("shrink-0", isGrid ? "mt-3" : "")}>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
            todo.completed
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {todo.completed ? "Completed" : "In Progress"}
        </span>
      </div>
    </motion.div>
  );
};
