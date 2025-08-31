"use client";
import { UserButton } from "@clerk/nextjs";
import { Trello } from "lucide-react";
import Link from "next/link";
import React from "react";

export const DashboardNav = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/"  className="flex items-center space-x-2">
            <Trello className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              Trello Clone
            </span>
          </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
