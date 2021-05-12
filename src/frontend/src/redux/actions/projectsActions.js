import * as types from "../../constants";
import { getProjects } from "../../services/projectsService";
import { postProjects } from "../../services/projectsService";

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
