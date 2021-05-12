import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./themeReducer";
import authReducer from "./authReducer";
import projectReducer from "./projectsReducer";
import projectsSlice from "../slices/projectsSlice";

export const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  projects: projectReducer,
});
