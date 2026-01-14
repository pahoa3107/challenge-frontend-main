import { Bell } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { Todo } from "~/types";

interface NotificationBellProps {
  todos: Todo[];
}

export default function NotificationBell({ todos }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const getNearDueTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays <= 1;
    });
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    
    return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const nearDueTasks = getNearDueTasks();
  const count = nearDueTasks.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Upcoming Deadlines</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {count} {count === 1 ? 'task' : 'tasks'} due soon
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {nearDueTasks.map((todo) => (
            <div
              key={todo.id}
              className="p-3 border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors"
            >
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {todo.title}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                {formatDueDate(todo.dueDate!)}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
