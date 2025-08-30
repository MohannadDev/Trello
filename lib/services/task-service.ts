import { Task } from "../supabase/modals";
import { SupabaseClient } from "@supabase/supabase-js";

export const taskService = {
  async getTasksByBoard(
    supabase: SupabaseClient,
    boardId: number
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createTask(
    supabase: SupabaseClient,
    task: Omit<Task, "id" | "created_at" | "updated_at">
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTask(
    supabase: SupabaseClient,
    taskId: number,
    updates: Partial<Task>
  ): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString })
      .eq("id", taskId)
      .single();
    if (error) throw error;
    return data;
  },

  async moveTask(
    supabase: SupabaseClient,
    taskId: number,
    newColumnId: number,
    newOrder: number
  ) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        column_id: newColumnId,
        sort_order: newOrder
      })
      .eq("id", taskId);
    if (error) throw error;
    return data;
  }
};