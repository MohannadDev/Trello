"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { boardDataService, boardService } from "../services";
import { Board, Column } from "../supabase/modals";
import { useSupabase } from "../supabase/supabase-provider";

export function useBoards() {
  const { user } = useUser();
  const { supabase, isLoaded } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (user && supabase && isLoaded) loadBoards();
  }, [user, supabase, isLoaded]);

  async function loadBoards() {
    if (!user || !supabase) return;
    try {
      setIsLoading(true);
      const boards = await boardService.getBoards(supabase, user.id);
      setBoards(boards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load boards");
    } finally {
      setIsLoading(false);
    }
  }
  async function createBoard(boardData: {
    title: string;
    description?: string;
    color: string;
  }) {
    if (!user) throw new Error("User not authenticated");
    try {
      setIsLoading(true);

      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id
        }
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create board");
    } finally {
      setIsLoading(false);
    }
  }
  return { createBoard, isLoading, error, boards };
}
export function useBoard(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if ( supabase && boardId) loadBoard(boardId);
  }, [ supabase, boardId]);
  // useEffect(() => {
  //   if (boardId) loadBoard(boardId);
  // }, [user, supabase]);

  async function loadBoard(boardId: string) {
    if (!user) return;

    try {
      setIsLoading(true);

      const {board, columns} = await boardDataService.getBoardWithColumns(supabase!, boardId);
      console.log(board)
      setBoard(board);
      setColumns(columns)
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load board");
    } finally {
      setIsLoading(false);
    }
  }
  return { board, columns, isLoading, error };
}
