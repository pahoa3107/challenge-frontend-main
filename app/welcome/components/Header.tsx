import { CheckSquare } from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";
import type { User } from "~/types";

interface IProps {
  users: User[];
}

export default function Header({ users }: IProps) {
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
      <ThemeToggle />
    </div>
  );
}
