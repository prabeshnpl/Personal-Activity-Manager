import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/users/pages/LoginPage";
import RegisterPage from "../features/users/pages/RegisterPage";
import App from "../App";
import ErrorMessage from "../shared/components/Error/ErrorMessage";
import { authLoader } from "./authLoader";
import { Dashboard } from "../features/dashboard/pages/Dashboard";
import { OrganizationPage } from "../features/organization/pages/OrganizationPage";
import { FinancePage } from "../features/finance/pages/FinancePage";
import TasksPage from "../features/tasks/pages/TaskPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: authLoader,
    element: <App />,
    errorElement: <ErrorMessage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "roadmaps", element: <div className="p-6">Roadmaps Module</div> },
      { path: "finance", element: <FinancePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "organization", element: <OrganizationPage /> },
      { path: "notifications", element: <div className="p-6">Notifications</div> },
      { path: "settings", element: <div className="p-6">Settings</div> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorMessage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorMessage />,
  },

]);