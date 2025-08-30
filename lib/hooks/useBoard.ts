"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import {
  boardDataService,
  boardService,
  columnService,
  taskService
} from "../services";
import { Board, ColumnWithTasks, Task } from "../supabase/modals";
import { useSupabase } from "../supabase/supabase-provider";
export function useBoard(boardId: number) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(
    async (boardId: number) => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { board, columnsWithTasks } =
          await boardDataService.getBoardWithColumns(supabase!, boardId);
        setBoard(board);
        setColumns(columnsWithTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "failed to load board");
      } finally {
        setIsLoading(false);
      }
    },
    [user, supabase]
  );
  const updateBoard = async (boardId: number, updates: Partial<Board>) => {
    if (!user) return;

    try {
      const board = await boardService.updateBoard(supabase!, boardId, updates);
      setBoard(board);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to update board");
    } finally {
    }
  };
  const createRealTask = async (
    columnId: number,
    taskData: {
      board_id: number;
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority: "low" | "medium" | "high";
    }
  ) => {
    if (!user) return;
    try {
      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        column_id: columnId,
        board_id: taskData.board_id,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
        priority: taskData.priority || "medium"
      });

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create task");
    } finally {
    }
  };
  async function moveTask(
    taskId: number,
    newColumnId: number,
    newOrder: number
  ) {
    try {
      await taskService.moveTask(supabase!, taskId, newColumnId, newOrder);

      setColumns((prev) => {
        const newColumns = [...prev];

        // Find and remove task from the old column
        let taskToMove: Task | null = null;
        for (const col of newColumns) {
          const taskIndex = col.tasks.findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = col.tasks[taskIndex];
            col.tasks.splice(taskIndex, 1);
            break;
          }
        }

        if (taskToMove) {
          // Add task to new column
          const targetColumn = newColumns.find((col) => col.id === newColumnId);
          if (targetColumn) {
            targetColumn.tasks.splice(newOrder, 0, taskToMove);
          }
        }

        return newColumns;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move task.");
    }
  }

  async function createColumn(title: string) {
    if (!board || !user) throw new Error("Board not loaded");

    try {
      const newColumn = await columnService.createColumn(supabase!, {
        title,
        board_id: board.id,
        sort_order: columns.length,
        user_id: user.id
      });

      setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
      return newColumn;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create column.");
    }
  }
  async function updateColumn(columnId: number, title: string) {
    try {
      const updatedColumn = await columnService.updateColumnTitle(
        supabase!,
        columnId,
        title
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, ...updatedColumn } : col
        )
      );

      return updatedColumn;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create column.");
    }
  }

  useEffect(() => {
    if (supabase && boardId) loadBoard(boardId);
  }, [supabase, boardId, loadBoard]);

  return {
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
  };
}
