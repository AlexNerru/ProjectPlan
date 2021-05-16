import * as types from "../../constants";
import {
  getCostsData,
  getCostsDataAll,
  getWorkHoursData,
  getWorkHoursDataAll,
} from "../../services/chartsService";

export function getWorkHoursAction(token, projectID) {
  return async (dispatch) => {
    dispatch({ type: types.WORK_HOURS_CHART_REQUEST });

    return getWorkHoursData(token, projectID)
      .then((response) => {
        dispatch({
          type: types.WORK_HOURS_CHART_SUCCESS,
          workHours: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.WORK_HOURS_CHART_FAILURE });
        throw error;
      });
  };
}

export function getCostsAction(token, projectID) {
  return async (dispatch) => {
    dispatch({ type: types.COSTS_CHART_REQUEST });

    return getCostsData(token, projectID)
      .then((response) => {
        dispatch({
          type: types.COSTS_CHART_SUCCESS,
          costs: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.COSTS_CHART_FAILURE });
        throw error;
      });
  };
}

export function getWorkHoursAllAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.WORK_HOURS_ALL_CHART_REQUEST });

    return getWorkHoursDataAll(token)
      .then((response) => {
        dispatch({
          type: types.WORK_HOURS_ALL_CHART_SUCCESS,
          workHours: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.WORK_HOURS_ALL_CHART_FAILURE });
        throw error;
      });
  };
}

export function getCostsActionAll(token) {
  return async (dispatch) => {
    dispatch({ type: types.COSTS_ALL_CHART_REQUEST });

    return getCostsDataAll(token)
      .then((response) => {
        dispatch({
          type: types.COSTS_ALL_CHART_SUCCESS,
          costs: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.COSTS_ALL_CHART_FAILURE });
        throw error;
      });
  };
}
