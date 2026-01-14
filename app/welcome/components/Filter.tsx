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
import { TODO_STATUS, TODO_VIEW } from "~/enums/todo.enum";
import { TodoSort, TodoStatus } from "~/constants/todo.constant";

interface Props {
  filterByText: FilterProps;
  filterByUser: {
    value: number | null;
    onChange: (value: number | null) => void;
  };
  filterByStatus: {
    value: TODO_STATUS;
    onChange: (value: TODO_STATUS) => void;
  };
  sortBy: FilterProps;
  users: User[];
  viewAction: {
    view: TODO_VIEW;
    setView: (view: TODO_VIEW) => void;
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
          value={filterByStatus?.value || TODO_STATUS.ALL}
          onValueChange={(v) => filterByStatus?.onChange(v as TODO_STATUS)}
        >
          <SelectTrigger className="w-40 bg-secondary/50 border-0">
            <CheckCircle2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {TodoStatus.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy?.value as any} onValueChange={(v) => sortBy?.onChange(v)}>
          <SelectTrigger className="w-35 bg-secondary/50 border-0">
            <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {TodoSort.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex ml-auto rounded-lg border border-border overflow-hidden">
          <Button
            variant={viewAction?.view === TODO_VIEW.LIST ? "secondary" : "ghost"}
            size="sm"
            onClick={() => viewAction?.setView(TODO_VIEW.LIST)}
            className="rounded-none px-3"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewAction?.view === TODO_VIEW.GRID ? "secondary" : "ghost"}
            size="sm"
            onClick={() => viewAction?.setView(TODO_VIEW.GRID)}
            className="rounded-none px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
