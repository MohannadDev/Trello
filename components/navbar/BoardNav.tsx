"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Filter, Trello } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface BoardNavProps {
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
}

export const BoardNav = ({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0
}: BoardNavProps) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="h-4 sm:h-6 w-px bg-gray-300 hidden sm:block" />
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <Trello className="text-blue-600" />
              <div className="items-center space-x-1 sm:space-x-2 min-w-0">
                <span className="text-lg font-bold text-gray-900 truncate">
                  {boardTitle}
                </span>
                {onEditBoard && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 flex-shrink-0 p-0"
                    onClick={onEditBoard}
                  >
                    <Edit />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {onFilterClick && (
              <Button
                variant="outline"
                size="sm"
                className={`text-xs sm:text-sm ${
                  filterCount > 0 ? "bg-blue-100 border-blue-200" : ""
                }`}
                onClick={onFilterClick}
              >
                <Filter className="h-3 w-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Filter</span>
                {filterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs ml-1 sm:ml-2 bg-blue-100 border-blue-200"
                  >
                    {filterCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
