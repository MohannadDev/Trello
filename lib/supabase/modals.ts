export interface Board {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string | null;
  color?: string | null;
  user_id: string;
}

export interface Column {
  id: number;
  created_at: string;
  board_id: number;
  title: string;
  sort_order: number;
  user_id: string;
}

export interface Task {
  id: number;
  created_at: string;
  title: string;
  description?: string | null;
  assignee?: string | null;
  due_date?: string | null;
  priority?: "low" | "medium" | "high";
  sort_order: number;
  column_id: number;
  board_id: number;
}
export interface ColumnWithTasks extends Column {
  tasks: Task[];
}
