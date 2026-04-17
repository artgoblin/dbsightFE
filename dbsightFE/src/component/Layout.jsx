import { Outlet, Link, useLocation } from "react-router";
import { Database, MessageSquare, Code, Settings } from "lucide-react";
import { cn } from "./ui/utils";

import React, { useState } from "react";
import DatabaseInfoPanel from "./DatabaseInfoPanel";
import SchemaViewPanel from "./SchemaViewPanel";
import { useReconnectDatabaseMutation } from "../features/schema/databaseConnectionApi";
import AIChatInterface from "./pages/AIChatInterface";

const Layout = () => {
  const [reconnectDatabase] = useReconnectDatabaseMutation();
  const [database, setDatabase] = useState("Adventureworks");
  const location = useLocation();

  const navigation = [
    { id: 1, name: "AI Chat", href: "/", icon: MessageSquare },
    { id: 2, name: "Query Execution", href: "/query", icon: Code },
    { id: 3, name: "Connections", href: "/connections", icon: Database },
  ];
  return (
    <div className="flex h-screen bg-zinc-900">
      <div className="h-screen w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-3 border-b border-zinc-800">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Database className="h-4 w-4 text-white" />
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center p-2 justify-center hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors",
                  isActive && "bg-zinc-800",
                )}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 text-zinc-400 hover:text-blue-500 transition-colors",
                    isActive && "text-blue-500",
                  )}
                />
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-zinc-800">
          <div className="flex items-center justify-center h-10 w-10 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="w-60 flex flex-col">
        <div className="p-3 border-b border-r border-zinc-800">
          <DatabaseInfoPanel
            reconnectDatabase={reconnectDatabase}
            database={database}
            setDatabase={setDatabase}
          />
        </div>
        <div className="p-4 border-b border-r border-zinc-800">
          <h2 className="font-semibold text-white text-sm">
            Database Navigator
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Schema & Tables</p>
        </div>
        <div className="flex-1 overflow-auto border-r border-zinc-800 custom-scrollbar">
          <SchemaViewPanel databaseName={database} />
        </div>
      </div>
      <div className="flex-1 h-full bg-black">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
