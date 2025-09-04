import { useState } from "react";
import { ColumnWithTasks } from "../supabase/models";

export function useBoardDialogs() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [isCreatingTaskDialogOpen, setIsCreatingTaskDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(null);

  const openEditBoard = (title: string, color: string) => {
    setNewTitle(title);
    setNewColor(color);
    setIsEditingTitle(true);
  };

  const closeEditBoard = () => {
    setIsEditingTitle(false);
    setNewTitle("");
    setNewColor("");
  };

  const openEditColumn = (column: ColumnWithTasks) => {
    setIsEditingColumn(true);
    setEditingColumn(column);
    setEditingColumnTitle(column.title);
  };

  const closeEditColumn = () => {
    setIsEditingColumn(false);
    setEditingColumn(null);
    setEditingColumnTitle("");
  };

  const closeCreateColumn = () => {
    setIsCreatingColumn(false);
    setNewColumnTitle("");
  };

  const openCreateTask = () => {
    setIsCreatingTaskDialogOpen(true);
  };

  const closeCreateTask = () => {
    setIsCreatingTaskDialogOpen(false);
  };

  return {
    // States
    isEditingTitle,
    isFilterOpen,
    isCreatingColumn,
    isEditingColumn,
    isCreatingTaskDialogOpen, 
    newTitle,
    newColor,
    newColumnTitle,
    editingColumnTitle,
    editingColumn,
    
    // Setters
    setIsFilterOpen,
    setIsCreatingColumn,
    setIsCreatingTaskDialogOpen, 
    setNewTitle,
    setNewColor,
    setNewColumnTitle,
    setEditingColumnTitle,
    
    // Actions
    openEditBoard,
    closeEditBoard,
    openEditColumn,
    closeEditColumn,
    closeCreateColumn,
    openCreateTask, 
    closeCreateTask, 
  };
}