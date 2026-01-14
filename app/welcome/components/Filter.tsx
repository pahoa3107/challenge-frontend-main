import type { FilterProps, User } from "../../types";
import { Search, SortAsc, Grid3X3, List, FilterIcon, CheckCircle2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

interface Props {
  filterByText: FilterProps;
  filterByUser: {
    value: number | null;
    onChange: (value: number | null) => void;
  };
  filterByStatus: {
    value: "all" | "completed" | "in-progress" | "overdue";
    onChange: (value: "all" | "completed" | "in-progress" | "overdue") => void;
  };
  sortBy: FilterProps;
  users: User[];
  viewAction: {
    view: "list" | "grid";
    setView: (view: "list" | "grid") => void;
  };
}

export default function Filter({
  filterByText,
  filterByUser,
  filterByStatus,
  sortBy,
  users,
  viewAction
}: Props) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Enter word to search..."
          value={filterByText.value}
          onChange={(e) => filterByText.onChange(e.target.value)}
          className="pl-10 bg-secondary/50 border-0 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={filterByUser?.value?.toString() || "all"}
          onValueChange={(v) => filterByUser?.onChange?.(v === "all" ? null : parseInt(v))}
        >
          <SelectTrigger className="w-40 bg-secondary/50 border-0">
            <FilterIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filterByStatus?.value || "all"}
          onValueChange={(v) => filterByStatus?.onChange(v as "all" | "completed" | "in-progress")}
        >
          <SelectTrigger className="w-40 bg-secondary/50 border-0">
            <CheckCircle2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy?.value as any} onValueChange={(v) => sortBy?.onChange(v)}>
          <SelectTrigger className="w-35 bg-secondary/50 border-0">
            <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="id">By ID</SelectItem>
            <SelectItem value="title">By Title</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex ml-auto rounded-lg border border-border overflow-hidden">
          <Button
            variant={viewAction?.view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => viewAction?.setView("list")}
            className="rounded-none px-3"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewAction?.view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => viewAction?.setView("grid")}
            className="rounded-none px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
