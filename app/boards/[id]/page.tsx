"use client";
import Navbar from "@/components/navbar";
import { useBoard } from "@/lib/hooks/useBoards";
import { use } from "react";
export default function BoardPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { board, columns, isLoading, error } = useBoard(id);

  if (isLoading) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <span>Loading your boards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div>
      <Navbar />

      <h1>Board</h1>
    </div>
  );
}
