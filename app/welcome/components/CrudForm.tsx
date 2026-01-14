import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Todo, User } from "~/types";

interface CrudFormProps {
  users: User[];
  onAdd: (title: string, userId: number, dueDate?: string) => void;
  onUpdate?: (id: number, updates: Partial<Todo>) => void;
  editingTodo?: Todo | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function CrudForm({
  users,
  onAdd,
  onUpdate,
  editingTodo = null,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}: CrudFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<string>("");

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditMode = !!editingTodo;

  const hasChanges = useMemo(() => {
    if (!isEditMode || !editingTodo) return true;

    const currentTitle = title.trim();
    const currentUserId = userId ? parseInt(userId) : null;
    const currentCompleted = completed;
    const currentDueDate = dueDate || undefined;

    return (
      currentTitle !== editingTodo.title ||
      currentUserId !== editingTodo.userId ||
      currentCompleted !== editingTodo.completed ||
      currentDueDate !== editingTodo.dueDate
    );
  }, [isEditMode, editingTodo, title, userId, completed, dueDate]);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setUserId(editingTodo.userId.toString());
      setCompleted(editingTodo.completed);
      setDueDate(editingTodo.dueDate || "");
    }
  }, [editingTodo]);

  useEffect(() => {
    if (open && !editingTodo) {
      setTitle("");
      setUserId("");
      setCompleted(false);
      setDueDate("");
    }
  }, [open, editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && userId) {
      if (isEditMode && editingTodo && onUpdate) {
        onUpdate(editingTodo.id, {
          title: title.trim(),
          userId: parseInt(userId),
          completed,
          dueDate: dueDate || undefined,
        });
      } else {
        onAdd(title, parseInt(userId), dueDate || undefined);
      }
      setOpen(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && editingTodo) {
      setTitle(editingTodo.title);
      setUserId(editingTodo.userId.toString());
      setCompleted(editingTodo.completed);
      setDueDate(editingTodo.dueDate || "");
    } else {
      setTitle("");
      setUserId("");
      setCompleted(false);
      setDueDate("");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary/50 border-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user">Assigned By</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full bg-secondary/50 border-0">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              className="w-full bg-secondary/50 border-0 cursor-pointer"
              placeholder="Select date"
            />
          </div>
          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={completed ? "completed" : "in-progress"} onValueChange={(v) => setCompleted(v === "completed")}>
                <SelectTrigger className="w-full bg-secondary/50 border-0">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !title.trim() ||
                !userId ||
                (isEditMode && !hasChanges)
              }
              className="gradient-primary text-primary-foreground"
            >
              {isEditMode ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
