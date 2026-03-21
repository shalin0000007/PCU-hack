import { createBrowserRouter, redirect } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewApplication from "./pages/NewApplication";
import AnalysisProcess from "./pages/AnalysisProcess";
import CreditRiskAnalysis from "./pages/CreditRiskAnalysis";
import ReportPreview from "./pages/ReportPreview";
import History from "./pages/History";
import Settings from "./pages/Settings";

// Auth check loader
const requireAuth = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return redirect("/");
  }
  return null;
};

// Redirect to dashboard if already logged in
const redirectIfAuth = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
    loader: redirectIfAuth,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    loader: requireAuth,
  },
  {
    path: "/new-application",
    Component: NewApplication,
    loader: requireAuth,
  },
  {
    path: "/analysis-process/:id",
    Component: AnalysisProcess,
    loader: requireAuth,
  },
  {
    path: "/credit-analysis/:id",
    Component: CreditRiskAnalysis,
    loader: requireAuth,
  },
  {
    path: "/report/:id",
    Component: ReportPreview,
    loader: requireAuth,
  },
  {
    path: "/history",
    Component: History,
    loader: requireAuth,
  },
  {
    path: "/settings",
    Component: Settings,
    loader: requireAuth,
  },
  {
    path: "/analysis",
    Component: Dashboard,
    loader: requireAuth,
  },
  {
    path: "/reports",
    Component: History,
    loader: requireAuth,
  },
]);
