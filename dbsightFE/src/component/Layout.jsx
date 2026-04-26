import { Outlet, Link, useLocation } from "react-router";
import { Database, MessageSquare, Code, Settings, LogOut } from "lucide-react";
import { cn } from "./ui/utils";

import React, { useState } from "react";
import DatabaseInfoPanel from "./DatabaseInfoPanel";
import SchemaViewPanel from "./SchemaViewPanel";
import { useReconnectDatabaseMutation } from "../features/schema/databaseConnectionApi";
import AIChatInterface from "./pages/AIChatInterface";
import { Popover } from "@mui/material";

const Layout = () => {
  const [reconnectDatabase] = useReconnectDatabaseMutation();
  const [database, setDatabase] = useState("Adventureworks");
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
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
            <Settings onClick={handlePopoverOpen} className="h-5 w-5" />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              slotProps={{
                paper: {
                  className:
                    "bg-zinc-800 border border-zinc-700 text-white p-1 min-w-[120px] ml-2",
                },
              }}
            >
              <div
                onClick={logout}
                className="flex items-center bg-zinc-800 gap-2 px-3 py-2 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-zinc-300 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </Popover>
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
        <Outlet context={{ database }} />
      </div>
    </div>
  );
};

export default Layout;
