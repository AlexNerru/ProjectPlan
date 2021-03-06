import * as types from "./constants";
import {
  deleteProject,
  getProjects,
  patchProject,
  postProjects,
} from "../../services/projectsService";

export function getProjectsAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.PROJECTS_GET_REQUEST });

    return getProjects(token)
      .then((response) => {
        dispatch({
          type: types.PROJECTS_GET_SUCCESS,
          projects: response.results,
        });
      })
      .catch((error) => {
        dispatch({ type: types.PROJECTS_GET_FAILURE });
        throw error;
      });
  };
}

export function addProjectsAction(token, user, data) {
  return async (dispatch) => {
    dispatch({ type: types.PROJECTS_ADD_REQUEST });

    return postProjects(token, user, data)
      .then((response) => {
        dispatch({
          type: types.PROJECTS_ADD_SUCCESS,
          projects: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.PROJECTS_ADD_FAILURE });
        throw error;
      });
  };
}

export function patchProjectsAction(token, id, data) {
  return async (dispatch) => {
    dispatch({ type: types.PROJECTS_PATCH_REQUEST });

    return patchProject(token, id, data)
      .then((response) => {
        dispatch({
          type: types.PROJECTS_PATCH_SUCCESS,
          project: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.PROJECTS_PATCH_FAILURE });
        throw error;
      });
  };
}

export function deleteProjectsAction(token, id) {
  return async (dispatch) => {
    dispatch({ type: types.PROJECTS_DELETE_REQUEST });

    return deleteProject(token, id)
      .then((id) => {
        dispatch({
          type: types.PROJECTS_DELETE_SUCCESS,
          id: id,
        });
      })
      .catch((error) => {
        dispatch({ type: types.PROJECTS_DELETE_FAILURE });
        throw error;
      });
  };
}
