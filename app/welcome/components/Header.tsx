import { CheckSquare } from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";
import type { Todo, User } from "~/types";
import CrudForm from "./CrudForm";
import NotificationBell from "./NotificationBell";

interface IProps {
  users: User[];
  todos: Todo[];
  onAdd: (title: string, userId: number, dueDate?: string) => void;
  onUpdate?: (id: number, updates: Partial<Todo>) => void;
  editingTodo?: Todo | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Header({ 
  users, 
  todos,
  onAdd, 
  onUpdate,
  editingTodo,
  open,
  onOpenChange,
}: IProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <CheckSquare className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Todo Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Managing tasks for {users.length} users
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell todos={todos} />
        <CrudForm 
          users={users} 
          onAdd={onAdd}
          onUpdate={onUpdate}
          editingTodo={editingTodo}
          open={open}
          onOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
}
