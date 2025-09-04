"use client";
import DroppableColumn from "@/components/draggable-column";
import Navbar from "@/components/navbar";
import SortableTask, { TaskOverlay } from "@/components/sortable-task";
import { BoardDialogs } from "@/components/board/BoardDialogs";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/lib/hooks/useBoard";
import { useBoardDialogs } from "@/lib/hooks/useBoardDialogs";
import { useBoardFilters } from "@/lib/hooks/useBoardFilters";
import { useBoardDragDrop } from "@/lib/hooks/useBoardDragDrop";
import { ColumnWithTasks } from "@/lib/supabase/models";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { use } from "react";

export default function BoardPage({
  params
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const {
    board,
    columns,
    updateBoard,
    createRealTask,
    setColumns,
    createColumn,
    updateColumn,
    moveTask,
    isLoading,
    error
  } = useBoard(Number(id));

  const {
    isEditingTitle,
    isFilterOpen,
    isCreatingColumn,
    isEditingColumn,
    isCreatingTaskDialogOpen,
    newTitle,
    newColor,
    newColumnTitle,
    editingColumnTitle,
    editingColumn,
    setIsFilterOpen,
    setIsCreatingColumn,
    setNewTitle,
    setNewColor,
    setNewColumnTitle,
    setEditingColumnTitle,
    openEditBoard,
    closeEditBoard,
    openEditColumn,
    closeEditColumn,
    closeCreateColumn,
    openCreateTask,
    closeCreateTask
  } = useBoardDialogs();
  const { filteredColumns, filterCount, handleFilterChange, clearFilters } =
    useBoardFilters(columns);
  const {
    activeTask,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useBoardDragDrop(columns, setColumns, moveTask);

  // Event Handlers
  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(id, {
        title: newTitle.trim(),
        color: newColor || board.color
      });
      closeEditBoard();
    } catch (error) {
      console.error("Failed to update board:", error);
    }
  };

  const handleCreateTask = async (
    e: React.FormEvent<HTMLFormElement>,
    columnId?: number
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      board_id: Number(id),
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium"
    };

    if (taskData.title.trim()) {
      const targetColumn = columnId || columns[0]?.id;
      if (!targetColumn) {
        console.error("No column available to add task");
        return;
      }

      try {
        await createRealTask(targetColumn, taskData);
        // Close dialog using the hook function
        closeCreateTask();
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      await createColumn(newColumnTitle.trim());
      closeCreateColumn();
    } catch (error) {
      console.error("Failed to create column:", error);
    }
  };

  const handleUpdateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColumnTitle.trim() || !editingColumn) return;

    try {
      await updateColumn(
        editingColumn.id,
        editingColumnTitle.trim()
      );
      closeEditColumn();
    } catch (error) {
      console.error("Failed to update column:", error);
    }
  };

  const handleEditColumn = (column: ColumnWithTasks) => {
    openEditColumn(column);
  };

  if (isLoading) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <span>Loading your board...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() =>
          openEditBoard(board?.title ?? "", board?.color ?? "")
        }
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={filterCount}
      />

      <BoardDialogs
        isEditingTitle={isEditingTitle}
        isCreatingTaskDialogOpen={isCreatingTaskDialogOpen}
        onCloseCreateTask={closeCreateTask}
        newTitle={newTitle}
        newColor={newColor}
        onTitleChange={setNewTitle}
        onColorChange={setNewColor}
        onCloseEditBoard={closeEditBoard}
        onUpdateBoard={handleUpdateBoard}
        isFilterOpen={isFilterOpen}
        filters={{
          priority: [],
          assignee: [],
          dueDate: null
        }}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onCloseFilter={() => setIsFilterOpen(false)}
        onCreateTask={handleCreateTask}
        isCreatingColumn={isCreatingColumn}
        newColumnTitle={newColumnTitle}
        onColumnTitleChange={setNewColumnTitle}
        onCloseCreateColumn={closeCreateColumn}
        onCreateColumn={handleCreateColumn}
        isEditingColumn={isEditingColumn}
        editingColumnTitle={editingColumnTitle}
        editingColumn={editingColumn}
        onEditingColumnTitleChange={setEditingColumnTitle}
        onCloseEditColumn={closeEditColumn}
        onUpdateColumn={handleUpdateColumn}
      />

      {/* Board Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Tasks: </span>
              {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </div>
          </div>
          <Button className="w-full sm:w-auto" onClick={openCreateTask}>
            <Plus />
            Add Task
          </Button>
        </div>

        {/* Board columns */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
            {filteredColumns.map((column, key) => (
              <DroppableColumn
                key={key}
                column={column}
                onCreateTask={handleCreateTask}
                onEditColumn={handleEditColumn}
              >
                <SortableContext items={column.tasks.map((task) => task.id)}>
                  <div className="space-y-3">
                    {column.tasks.map((task, key) => (
                      <SortableTask task={task} key={key} />
                    ))}
                  </div>
                </SortableContext>
              </DroppableColumn>
            ))}

            <div className="w-full lg:flex-shrink-0 lg:w-80">
              <Button
                variant="outline"
                className="w-full h-full min-h-[200px] border-dashed border-2 text-gray-500 hover:text-gray-700"
                onClick={openCreateTask}
              >
                <Plus />
                Add another list
              </Button>
            </div>

            <DragOverlay>
              {activeTask ? <TaskOverlay task={activeTask} /> : null}
            </DragOverlay>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
