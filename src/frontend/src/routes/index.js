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

// Dashboards components
const Default = async(() => import("../pages/dashboards/Default"));

// Pages components
import Projects from "../pages/pages/Projects";
import Project from "../pages/pages/Project";
import Resources from "../pages/pages/Resources";

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
  component: Projects,
  children: null,
  guard: AuthGuard,
  exact: true,
};

const projectRoute = {
  id: "Project",
  path: "/projects/:projectID",
  component: Project,
  children: null,
  guard: AuthGuard,
};

const resourcesRoutes = {
  id: "Resources",
  path: "/resources",
  icon: <List />,
  component: Resources,
  children: null,
  guard: AuthGuard,
};

const calendarRoutes = {
  id: "Calendar",
  path: "/calendar",
  icon: <Calendar />,
  component: Projects, //TODO: change to calendar component
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
  ],
  component: null,
};

export const dashboardLayoutRoutes = [
  dashboardsRoutes,
  projectsRoutes,
  projectRoute,
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
  //calendarRoutes,
];
