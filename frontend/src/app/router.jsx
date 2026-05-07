/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../shared/layouts/AuthLayout";
import MainLayout from "../shared/layouts/MainLayout";
import PageLoadingState from "../shared/ui/organisms/PageLoadingState/PageLoadingState";
import RouteErrorBoundary from "../shared/ui/organisms/RouteErrorBoundary";
import { ROUTES } from "../shared/constants/routes";

const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const GatePassList = lazy(() => import("../pages/gatepass/GatePassList"));
const ProjectsList = lazy(() => import("../pages/projects/ProjectsList"));
const TasksList = lazy(() => import("../pages/tasks/TasksList"));
const Entries = lazy(() => import("../pages/entries/Entries"));
const UsersList = lazy(() => import("../pages/users/UsersList"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const Chat = lazy(() => import("../pages/chat/Chat"));
const NotFound = lazy(() => import("../pages/NotFound"));

const withSuspense = (Component) => (
	<Suspense fallback={<PageLoadingState />}>
		<Component />
	</Suspense>
);

export const router = createBrowserRouter([
	{
		path: ROUTES.HOME,
		element: <Navigate to={ROUTES.DASHBOARD} replace />,
	},
	{
		path: "/auth",
		element: <AuthLayout />,
		errorElement: <RouteErrorBoundary />,
		children: [
			{ path: "login", element: withSuspense(Login) },
			{ path: "forgot-password", element: withSuspense(ForgotPassword) },
			{ path: "reset-password/:token", element: withSuspense(ResetPassword) },
		],
	},
	{
		path: ROUTES.HOME,
		element: <MainLayout />,
		errorElement: <RouteErrorBoundary />,
		children: [
			{ path: "dashboard", element: withSuspense(Dashboard) },
			{ path: "projects", element: withSuspense(ProjectsList) },
			{ path: "tasks", element: withSuspense(TasksList) },
			{ path: "entries", element: withSuspense(Entries) },
			{ path: "gatepass", element: withSuspense(GatePassList) },
			{ path: "chat", element: withSuspense(Chat) },
			{ path: "users", element: withSuspense(UsersList) },
			{ path: "settings", element: withSuspense(Settings) },
			{ path: "reports", element: withSuspense(Reports) },
			{ path: "change-password", element: withSuspense(ChangePassword) },
		],
	},
	{
		path: "*",
		element: withSuspense(NotFound),
	},
]);
