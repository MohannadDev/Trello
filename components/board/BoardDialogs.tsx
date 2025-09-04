import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ColumnWithTasks, FilterState } from "@/lib/supabase/models";



interface BoardDialogsProps {
  // Edit Board Dialog
  isEditingTitle: boolean;
  newTitle: string;
  newColor: string;
  onTitleChange: (title: string) => void;
  onColorChange: (color: string) => void;
  onCloseEditBoard: () => void;
  onUpdateBoard: (e: React.FormEvent) => void;

  // Filter Dialog
  isFilterOpen: boolean;
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: string | string[] | null) => void;
  onClearFilters: () => void;
  onCloseFilter: () => void;

  // Create Task Dialog
  onCreateTask: (e: React.FormEvent<HTMLFormElement>, columnId?: number) => void;

  // Create Column Dialog
  isCreatingColumn: boolean;
  newColumnTitle: string;
  onColumnTitleChange: (title: string) => void;
  onCloseCreateColumn: () => void;
  onCreateColumn: (e: React.FormEvent) => void;

  // Edit Column Dialog
  isEditingColumn: boolean;
  editingColumnTitle: string;
  editingColumn: ColumnWithTasks | null;
  onEditingColumnTitleChange: (title: string) => void;
  onCloseEditColumn: () => void;
  onUpdateColumn: (e: React.FormEvent) => void;
}

const BOARD_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-gray-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-emerald-500",
];

const PRIORITY_OPTIONS = ["low", "medium", "high"];

export function BoardDialogs({
  isEditingTitle,
  newTitle,
  newColor,
  onTitleChange,
  onColorChange,
  onCloseEditBoard,
  onUpdateBoard,
  isFilterOpen,
  filters,
  onFilterChange,
  onClearFilters,
  onCloseFilter,
  onCreateTask,
  isCreatingColumn,
  newColumnTitle,
  onColumnTitleChange,
  onCloseCreateColumn,
  onCreateColumn,
  isEditingColumn,
  editingColumnTitle,
  onEditingColumnTitleChange,
  onCloseEditColumn,
  onUpdateColumn,
}: BoardDialogsProps) {
  return (
    <>
      {/* Edit Board Dialog */}
      <Dialog open={isEditingTitle} onOpenChange={onCloseEditBoard}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onUpdateBoard}>
            <div className="space-y-2">
              <Label htmlFor="boardTitle">Board Title</Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Enter board title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Board Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {BOARD_COLORS.map((color, key) => (
                  <button
                    key={key}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color} ${
                      color === newColor
                        ? "ring-2 ring-offset-2 ring-gray-900"
                        : ""
                    }`}
                    onClick={() => onColorChange(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCloseEditBoard}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={onCloseFilter}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((priority, key) => (
                  <Button
                    key={key}
                    onClick={() => {
                      const newPriorities = filters.priority.includes(priority)
                        ? filters.priority.filter((p) => p !== priority)
                        : [...filters.priority, priority];
                      onFilterChange("priority", newPriorities);
                    }}
                    variant={filters.priority.includes(priority) ? "default" : "outline"}
                    size="sm"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={filters.dueDate || ""}
                onChange={(e) => onFilterChange("dueDate", e.target.value || null)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onClearFilters}>
                Clear Filters
              </Button>
              <Button type="button" onClick={onCloseFilter}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <p className="text-sm text-gray-600">Add a task to the board</p>
          </DialogHeader>

          <form className="space-y-4" onSubmit={onCreateTask}>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input id="title" name="title" placeholder="Enter task title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Input
                id="assignee"
                name="assignee"
                placeholder="Who should do this?"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((priority, key) => (
                    <SelectItem key={key} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" id="dueDate" name="dueDate" />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Column Dialog */}
      <Dialog open={isCreatingColumn} onOpenChange={onCloseCreateColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
            <p className="text-sm text-gray-600">
              Add new column to organize your tasks
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onCreateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => onColumnTitleChange(e.target.value)}
                placeholder="Enter column title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button type="button" onClick={onCloseCreateColumn} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create Column</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Column Dialog */}
      <Dialog open={isEditingColumn} onOpenChange={onCloseEditColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            <p className="text-sm text-gray-600">
              Update the title of your column
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onUpdateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={editingColumnTitle}
                onChange={(e) => onEditingColumnTitleChange(e.target.value)}
                placeholder="Enter column title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button type="button" onClick={onCloseEditColumn} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Edit Column</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}