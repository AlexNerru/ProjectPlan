import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./themeReducer";
import authReducer from "./authReducer";
import projectReducer from "./projectsReducer";
import resourceReducer from "./resourcesReducer";
import taskReducer from "./tasksReducer";

export const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  projects: projectReducer,
  resources: resourceReducer,
  tasks: taskReducer,
});
