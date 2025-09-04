import { useState } from "react";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { ColumnWithTasks, Task } from "../supabase/models";

export function useBoardDragDrop(
  columns: ColumnWithTasks[],
  setColumns: React.Dispatch<React.SetStateAction<ColumnWithTasks[]>>,
  moveTask: (taskId: number, columnId: number, position: number) => Promise<void>
) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const targetColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === overId)
    );

    if (!sourceColumn || !targetColumn || sourceColumn.id !== targetColumn.id) return;

    const activeIndex = sourceColumn.tasks.findIndex((task) => task.id === activeId);
    const overIndex = targetColumn.tasks.findIndex((task) => task.id === overId);

    if (activeIndex !== overIndex) {
      setColumns((prev) => {
        const newColumns = [...prev];
        const column = newColumns.find((col) => col.id === sourceColumn.id);
        if (column) {
          const tasks = [...column.tasks];
          const [removed] = tasks.splice(activeIndex, 1);
          tasks.splice(overIndex, 0, removed);
          column.tasks = tasks;
        }
        return newColumns;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(Number(taskId), targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId)
      );

      if (sourceColumn && targetColumn) {
        const newIndex = targetColumn.tasks.findIndex((task) => task.id === overId);
        await moveTask(Number(taskId), targetColumn.id, newIndex);
      }
    }

    setActiveTask(null);
  };

  return {
    activeTask,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}