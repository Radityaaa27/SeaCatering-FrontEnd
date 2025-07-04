import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Subscription from "./pages/Subscription";
import ContactUs from "./pages/ContactUs";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Settings from "./pages/Settings";
import Order from "./pages/Order";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "subscription", element: <Subscription /> },
      { path: "order", element: <Order /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
