"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { boardDataService, boardService } from "../services";
import { Board } from "../supabase/models";
import { useSupabase } from "../supabase/supabase-provider";

export function useBoards() {
  const { user } = useUser();
  const { supabase, isLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoards = useCallback(async () => {
    if (!user || !supabase) return;
    try {
      setIsLoading(true);
      const boards = await boardService.getBoards(supabase, user.id);
      setBoards(boards);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "failed to load boards");
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not authenticated");
    try {
      setIsLoading(true);

      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
          color: boardData.color || "bg-blue-500"
        }
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create board");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (user && supabase && isLoaded) loadBoards();
  }, [user, supabase, isLoaded, loadBoards]);

  return { createBoard, isLoading, error, boards };
}
