import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./component/Layout";
import AIChatInterface from "./component/pages/AIChatInterface";
import QueryExecution from "./component/pages/QueryExecution";
import Connections from "./component/pages/Connections";
import { LoginPage } from "./component/LoginPage";

const isAuthenticated = () => !!localStorage.getItem("authToken");

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (isAuthenticated()) return window.location.replace("/");
      return null;
    },
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AIChatInterface /> },
      { path: "query", element: <QueryExecution /> },
      { path: "connections", element: <Connections /> },
    ],
  },
    {
    path: "*",
    element: <Navigate to={isAuthenticated() ? "/" : "/login"} replace />,
  },
]);
