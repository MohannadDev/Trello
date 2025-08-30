import { SupabaseClient } from "@supabase/supabase-js";
import { boardService } from "./board-service";
import { columnService } from "./column-service";
import { taskService } from "./task-service";

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