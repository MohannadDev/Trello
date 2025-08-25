"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { BoardNav } from "./BoardNav";
import { DashboardNav } from "./DashboardNav";
import { DefaultNav } from "./DefaultNav";

export interface NavbarProps {
  boardTitle?: string;
  onEditBoard?: () => void;
}

const Navbar = (props: NavbarProps) => {
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/board/");

  if (isDashboardPage) {
    return <DashboardNav />;
  } else if (isBoardPage) {
    return <BoardNav {...props} />;
  }

  return <DefaultNav />;
};

export default Navbar;
