import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../../shared/layouts/AuthLayout";
import MainLayout from "../../shared/layouts/MainLayout";

import Login from "../../pages/auth/Login";
import Dashboard from "../../pages/dashboard/Dashboard";
import GatePassList from "../../pages/gatepass/GatePassList";
import UsersList from "../../pages/users/UsersList";
import Settings from "../../pages/settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <div>Forgot Password</div> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "gatepass", element: <GatePassList /> },
      { path: "users", element: <UsersList /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <div className="p-8 text-center"><h1>404 Not Found</h1></div>,
  }
]);
