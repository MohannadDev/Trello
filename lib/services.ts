import { Board, Column } from "./supabase/modals";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();
    if (error) throw error;
    return data;
  }
};

const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async createColumn(
    supabase: SupabaseClient,

    column: Omit<Column, "id" | "created_at">
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
export const boardDataService = {
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    {
      title,
      description,
      color,
      userId
    }: {
      title: string;
      description?: string;
      color: string;
      userId: string;
    }
  ) {
    const board = await boardService.createBoard(supabase, {
      title,
      description: description || null,
      color: color || "bg-blue-500",
      user_id: userId
    });
    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 }
    ];
    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: userId
        })
      )
    );
    return board;
  },
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const board = await boardService.getBoard(supabase, boardId);
    const columns = await columnService.getColumns(supabase, boardId);
    return {
      board,
      columns
    };
  }
};
