import { Board } from "../supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export const boardService = {
  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, "id" | "created_at" | "updated_at">
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getBoard(supabase: SupabaseClient, boardId: number): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: number,
    updates: Partial<Board>
  ): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .update({ ...updates, updated_at: new Date().toISOString })
      .eq("id", boardId)
      .single();
    if (error) throw error;
    return data;
  }
};