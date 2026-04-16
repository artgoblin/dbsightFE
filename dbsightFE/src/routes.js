import { createBrowserRouter } from "react-router";
import Layout from "./component/Layout";
import AIChatInterface from "./component/pages/AIChatInterface";
import QueryExecution from "./component/pages/QueryExecution";
import Connections from "./component/pages/Connections";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AIChatInterface },
      { path: "query", Component: QueryExecution },
      { path: "connections", Component: Connections },
    ],
  },
]);