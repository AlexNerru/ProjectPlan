import { combineReducers } from "redux";

import themeReducer from "./theme/themeReducer";
import authReducer from "./auth/authReducer";
import projectReducer from "./projects/reducer";
import resourceReducer from "./resources/resourcesReducer";
import taskReducer from "./tasks/tasksReducer";
import chartReducer from "./charts/reducer";

export const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  projects: projectReducer,
  resources: resourceReducer,
  tasks: taskReducer,
  charts: chartReducer,
});
