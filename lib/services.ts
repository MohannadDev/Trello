import { Board, Column, Task } from "./supabase/models";
import {  SupabaseClient } from "@supabase/supabase-js";

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
  },

};

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
  },   async moveTask(
    supabase: SupabaseClient,
    taskId: number,
    newColumnId: number,
    newOrder: number
  ) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        column_id: newColumnId,
        sort_order: newOrder,
      })
      .eq("id", taskId);

    if (error) throw error;
    return data;
  },

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
  async getBoardWithColumns(supabase: SupabaseClient, boardId: number) {
    const board = await boardService.getBoard(supabase, boardId);
    const columns = await columnService.getColumns(supabase, boardId);
    const tasks = await taskService.getTasksByBoard(supabase, boardId);

    const columnsWithTasks = columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task) => task.column_id === column.id)
    }));
    return {
      board,
      columnsWithTasks
    };
  }
};
