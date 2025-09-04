import { useState, useMemo } from "react";
import { ColumnWithTasks, FilterState } from "../supabase/models";



export function useBoardFilters(columns: ColumnWithTasks[]) {
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    assignee: [],
    dueDate: null,
  });

  const handleFilterChange = (
    type: keyof FilterState,
    value: string | string[] | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: [],
      assignee: [],
      dueDate: null,
    });
  };

  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        // Filter by priority
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority || "")
        ) {
          return false;
        }

        // Filter by due date
        if (filters.dueDate && task.due_date) {
          const taskDate = new Date(task.due_date).toDateString();
          const filterDate = new Date(filters.dueDate).toDateString();
          if (taskDate !== filterDate) {
            return false;
          }
        }

        return true;
      }),
    }));
  }, [columns, filters]);

  const filterCount = Object.values(filters).reduce(
    (count, v) => count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
    0
  );

  return {
    filters,
    filteredColumns,
    filterCount,
    handleFilterChange,
    clearFilters,
  };
}