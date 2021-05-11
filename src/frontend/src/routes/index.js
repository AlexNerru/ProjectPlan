/* eslint-disable import/first */
import React from "react";

import async from "../components/Async";

import { Briefcase, Calendar, List, Sliders, Users } from "react-feather";

// All pages that rely on 3rd party components (other than Material-UI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Guards
import AuthGuard from "../components/AuthGuard";

// Auth components
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Page404 from "../pages/auth/Page404";
import Page500 from "../pages/auth/Page500";

// Components components
import Accordion from "../pages/components/Accordion";
import Alerts from "../pages/components/Alerts";
import Avatars from "../pages/components/Avatars";
import Badges from "../pages/components/Badges";
import Buttons from "../pages/components/Buttons";
import Cards from "../pages/components/Cards";
import Chips from "../pages/components/Chips";
import Dialogs from "../pages/components/Dialogs";
import Lists from "../pages/components/Lists";
import Menus from "../pages/components/Menus";
import Pagination from "../pages/components/Pagination";
import Progress from "../pages/components/Progress";
import Snackbars from "../pages/components/Snackbars";
import Tooltips from "../pages/components/Tooltips";

// Dashboards components
const Default = async(() => import("../pages/dashboards/Default"));
const Analytics = async(() => import("../pages/dashboards/Analytics"));
const SaaS = async(() => import("../pages/dashboards/SaaS"));

// Forms components
import SelectionCtrls from "../pages/forms/SelectionControls";
import Selects from "../pages/forms/Selects";
import TextFields from "../pages/forms/TextFields";
const Pickers = async(() => import("../pages/forms/Pickers"));
const Dropzone = async(() => import("../pages/forms/Dropzone"));
const Editors = async(() => import("../pages/forms/Editors"));
const Formik = async(() => import("../pages/forms/Formik"));

// Icons components
import MaterialIcons from "../pages/icons/MaterialIcons";
const FeatherIcons = async(() => import("../pages/icons/FeatherIcons"));

// Pages components
import Blank from "../pages/pages/Blank";
import InvoiceDetails from "../pages/pages/InvoiceDetails";
import InvoiceList from "../pages/pages/InvoiceList";
import Orders from "../pages/pages/Orders";
import Pricing from "../pages/pages/Pricing";
import Settings from "../pages/pages/Settings";
import Projects from "../pages/pages/Projects";
import Chat from "../pages/pages/Chat";
const Profile = async(() => import("../pages/pages/Profile"));
const Tasks = async(() => import("../pages/pages/Tasks"));
const CalendarPage = async(() => import("../pages/pages/Calendar"));

// Tables components
import SimpleTable from "../pages/tables/SimpleTable";
import AdvancedTable from "../pages/tables/AdvancedTable";

// Chart components
const Chartjs = async(() => import("../pages/charts/Chartjs"));

// Maps components
const GoogleMaps = async(() => import("../pages/maps/GoogleMaps"));
const VectorMaps = async(() => import("../pages/maps/VectorMaps"));

// Documentation
import Welcome from "../pages/docs/Welcome";
import GettingStarted from "../pages/docs/GettingStarted";
import EnvironmentVariables from "../pages/docs/EnvironmentVariables";
import Deployment from "../pages/docs/Deployment";
import Theming from "../pages/docs/Theming";
import StateManagement from "../pages/docs/StateManagement";
import APICalls from "../pages/docs/APICalls";
import ESLintAndPrettier from "../pages/docs/ESLintAndPrettier";
import Support from "../pages/docs/Support";
import Changelog from "../pages/docs/Changelog";

const dashboardsRoutes = {
  id: "Dashboard",
  path: "/dashboard",
  header: "Pages",
  icon: <Sliders />,
  containsHome: true,
  guard: AuthGuard,
  children: [
    {
      path: "/dashboard/default",
      name: "Default",
      component: Default,
    },
  ],
  component: null,
};

const projectsRoutes = {
  id: "Projects",
  path: "/projects",
  icon: <Briefcase />,
  component: Orders,
  children: null,
  guard: AuthGuard,
};

const resourcesRoutes = {
  id: "Resources",
  path: "/resources",
  icon: <List />,
  component: Orders, //TODO: change to resources component
  children: null,
  guard: AuthGuard,
};

const calendarRoutes = {
  id: "Calendar",
  path: "/calendar",
  icon: <Calendar />,
  component: Orders, //TODO: change to calendar component
  children: null,
  guard: AuthGuard,
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp,
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

export const dashboardLayoutRoutes = [
  dashboardsRoutes,
  projectsRoutes,
  resourcesRoutes,
  calendarRoutes,
];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];

// Routes visible in the sidebar
export const sidebarRoutes = [
  dashboardsRoutes,
  projectsRoutes,
  resourcesRoutes,
  calendarRoutes,
];
