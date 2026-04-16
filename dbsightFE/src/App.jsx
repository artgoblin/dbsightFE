import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import Layout from "./component/Layout";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
