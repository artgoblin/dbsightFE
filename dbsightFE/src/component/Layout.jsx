import { Outlet, Link, useLocation } from "react-router";
import { Database, MessageSquare, Code, Settings } from "lucide-react";
import { cn } from "./ui/utils";

import React from "react";

const Layout = () => {
  const navigation = [
    { name: "AI Chat", href: "/", icon: MessageSquare },
    { name: "Query Execution", href: "/query", icon: Code },
    { name: "Connections", href: "/connections", icon: Database },
  ];
  return <div>Layout</div>;
};

export default Layout;
