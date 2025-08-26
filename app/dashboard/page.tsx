"use client";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { boardDataService } from "@/lib/services";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useUser } from "@clerk/nextjs";
import {
  Filter,
  Grid3x3,
  List,
  Plus,
  Rocket,
  Search,
  Trello
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DashboardPage = () => {
  const { supabase } = useSupabase();
  const { boards, isLoading, error } = useBoards();
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="contaienr mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold mb-2">
            Welcome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0].emailAddress}
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your boards today.
          </p>
          {/* <Button
            onClick={() => {
              boardDataService.createBoardWithDefaultColumns(supabase!, {
                title: "ddd",
                description: "ddd",
                color: "bg-red-400",
                userId: user?.id ?? ""
              });
            }}
          >
            create
          </Button> */}
        </div>
        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-600">
                      Total Boards
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {boards.length}
                    </p>
                  </div>
                </div>
                <div className="h-10 aspect-square sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trello className="h-5 aspect-square sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-600">
                      Recent Activity
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {
                        boards.filter((board) => {
                          const updatedAt = new Date(board.updated_at);
                          const oneWeekAgo = new Date();
                          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                          return updatedAt > oneWeekAgo;
                        }).length
                      }
                    </p>
                  </div>
                </div>
                <div className="h-10 aspect-square sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  📊{" "}
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-600">
                      Active Projects
                    </p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {boards.length}
                    </p>
                  </div>
                </div>
                <div className="h-10 aspect-square sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 aspect-square sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boards */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Boards
              </h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 bg-white border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List />
                </Button>
                <Button>
                  <Filter /> Filter{" "}
                </Button>
                <Button> Create Board </Button>
              </div>
            </div>
            {/* Search Bar */}
          </div>
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"  />
            <Input
              id="search"
              placeholder="Search boards..."
              className="pl-10"
            />
          </div>
          {/* boards grid/list */}

          {boards.length === 0 ? (
            <div className="h-dvh flex justify-center items-center">
              <h2 className="sm:text-lg">No boards yet</h2>{" "}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {boards.map((board, key) => (
                <Link href={`/boards/${board.id}`} key={key}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded`} />
                        <Badge className="text-xs" variant="secondary">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4">
                        {board.description}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                        <span>
                          Created{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(board.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              {boards.map((board, key) => (
                <div key={key} className={key > 0 ? "mt-4" : ""}>
                  <Link href={`/boards/${board.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-4 h-4 ${board.color} rounded`} />
                          <Badge className="text-xs" variant="secondary">
                            New
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {board.title}
                        </CardTitle>
                        <CardDescription className="text-sm mb-4">
                          {board.description}
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <span>
                            Created{" "}
                            {new Date(board.created_at).toLocaleDateString()}
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(board.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}

              <Card className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;