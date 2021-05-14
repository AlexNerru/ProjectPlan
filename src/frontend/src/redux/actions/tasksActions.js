import * as types from "../../constants";
import {
  deleteTask,
  getTasks,
  getTasksByProject,
  postTask,
} from "../../services/tasksService";

export function getTaskAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.TASKS_GET_PROJECT_REQUEST });

    return getTasks(token)
      .then((response) => {
        dispatch({
          type: types.TASKS_GET_SUCCESS,
          tasks: response.results,
        });
      })
      .catch((error) => {
        dispatch({ type: types.TASKS_GET_FAILURE });
        throw error;
      });
  };
}

export function getTasksByProjectAction(token, project) {
  return async (dispatch) => {
    dispatch({ type: types.TASKS_GET_PROJECT_REQUEST });

    return getTasksByProject(token, project)
      .then((response) => {
        dispatch({
          type: types.TASKS_GET_PROJECT_SUCCESS,
          tasks: response.results,
        });
      })
      .catch((error) => {
        dispatch({ type: types.TASKS_GET_PROJECT_FAILURE });
        throw error;
      });
  };
}

export function addTaskAction(token, user, project, data) {
  return async (dispatch) => {
    dispatch({ type: types.TASKS_ADD_REQUEST });

    return postTask(token, user, project, data)
      .then((response) => {
        dispatch({
          type: types.TASKS_ADD_SUCCESS,
          tasks: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.TASKS_ADD_FAILURE });
        throw error;
      });
  };
}

export function deleteTasksAction(token, id) {
  return async (dispatch) => {
    dispatch({ type: types.TASKS_DELETE_REQUEST });

    return deleteTask(token, id)
      .then((id) => {
        dispatch({
          type: types.TASKS_DELETE_SUCCESS,
          id: id,
        });
      })
      .catch((error) => {
        dispatch({ type: types.TASKS_DELETE_FAILURE });
        throw error;
      });
  };
}
