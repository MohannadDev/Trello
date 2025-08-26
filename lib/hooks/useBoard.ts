"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { boardDataService, boardService, taskService } from "../services";
import { Board, ColumnWithTasks } from "../supabase/modals";
import { useSupabase } from "../supabase/supabase-provider";
export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(
    async (boardId: string) => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { board, columnsWithTasks } =
          await boardDataService.getBoardWithColumns(supabase!, boardId);
        console.log(board);
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
  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    if (!user) return;

    try {
    //   setIsLoading(true);
      const board = await boardService.updateBoard(supabase!, boardId, updates);
      console.log(board);
      setBoard(board);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to update board");
    } finally {
    //   setIsLoading(false);
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
    //   setIsLoading(true);
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
      console.log(newTask);

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create task");
    } finally {
    //   setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supabase && boardId) loadBoard(boardId);
  }, [supabase, boardId, loadBoard]);

  return { board, columns, updateBoard, createRealTask, isLoading, error };
}
