import * as types from "../../constants";
import getProjects from "../../services/projectsService";

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
