import * as types from "../../constants";
import {
  deleteResource,
  getResources,
  getResourcesByProject,
  postResource,
} from "../../services/resourcesService";

export function getResourcesAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.RESOURCES_GET_REQUEST });

    return getResources(token)
      .then((response) => {
        dispatch({
          type: types.RESOURCES_GET_SUCCESS,
          resources: response.results,
        });
      })
      .catch((error) => {
        dispatch({ type: types.RESOURCES_GET_FAILURE });
        throw error;
      });
  };
}

export function getResourcesByProjectAction(token, project) {
  return async (dispatch) => {
    dispatch({ type: types.RESOURCES_GET_PROJECT_REQUEST });

    return getResourcesByProject(token, project)
      .then((response) => {
        dispatch({
          type: types.RESOURCES_GET_PROJECT_SUCCESS,
          resources: response.results,
        });
      })
      .catch((error) => {
        dispatch({ type: types.RESOURCES_GET_PROJECT_FAILURE });
        throw error;
      });
  };
}

export function addResourceAction(token, data) {
  return async (dispatch) => {
    dispatch({ type: types.RESOURCES_ADD_REQUEST });

    return postResource(token, data)
      .then((response) => {
        dispatch({
          type: types.RESOURCES_ADD_SUCCESS,
          resources: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.RESOURCES_ADD_FAILURE });
        throw error;
      });
  };
}

export function deleteResourcesAction(token, id) {
  return async (dispatch) => {
    dispatch({ type: types.RESOURCES_DELETE_REQUEST });

    return deleteResource(token, id)
      .then((id) => {
        dispatch({
          type: types.RESOURCES_DELETE_SUCCESS,
          id: id,
        });
      })
      .catch((error) => {
        dispatch({ type: types.RESOURCES_DELETE_FAILURE });
        throw error;
      });
  };
}
