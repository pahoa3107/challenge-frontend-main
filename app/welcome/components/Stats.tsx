import { CheckCircle2, Clock, Users, ListTodo } from "lucide-react";
import type { Todo } from "../../types";

interface IProps {
  todos?: Todo[];
  stats: {
    completed: number;
    inprogress: number;
    userCount: number;
    total: number;
  };
}

const statCards = [
  {
    key: "total",
    label: "All Tasks",
    icon: ListTodo,
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "inprogress",
    label: "In Progress",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "userCount",
    label: "Users",
    icon: Users,
    color: "text-muted-foreground",
    bgColor: "bg-secondary",
  },
];

export const Stats = (props: IProps) => {
  const { stats } = props;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="bg-card rounded-xl p-4 shadow-soft border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats[stat.key as keyof typeof stats]}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
