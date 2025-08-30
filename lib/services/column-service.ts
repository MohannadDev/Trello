import { Column } from "../supabase/modals";
import { SupabaseClient } from "@supabase/supabase-js";

export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: number
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
  },

  async updateColumnTitle(
    supabase: SupabaseClient,
    columnId: number,
    title: string
  ): Promise<Column> {
    const { data, error } = await supabase
      .from("columns")
      .update({ title })
      .eq("id", columnId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};