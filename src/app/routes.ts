import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewApplication from "./pages/NewApplication";
import AnalysisProcess from "./pages/AnalysisProcess";
import CreditRiskAnalysis from "./pages/CreditRiskAnalysis";
import ReportPreview from "./pages/ReportPreview";
import History from "./pages/History";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/new-application",
    Component: NewApplication,
  },
  {
    path: "/analysis-process/:id",
    Component: AnalysisProcess,
  },
  {
    path: "/credit-analysis/:id",
    Component: CreditRiskAnalysis,
  },
  {
    path: "/report/:id",
    Component: ReportPreview,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/analysis",
    Component: Dashboard,
  },
  {
    path: "/reports",
    Component: History,
  },
]);