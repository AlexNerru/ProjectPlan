import * as types from "../../constants";
import {
  getCostsData,
  getCostsDataAll,
  getDailyWorkHoursAllData,
  getDailyWorkHoursData,
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

export function getDailyWorkHoursAction(token, projectID) {
  return async (dispatch) => {
    dispatch({ type: types.DAILY_WORK_HOURS_CHART_REQUEST });

    return getDailyWorkHoursData(token, projectID)
      .then((response) => {
        dispatch({
          type: types.DAILY_WORK_HOURS_CHART_SUCCESS,
          workHours: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.DAILY_WORK_HOURS_CHART_FAILURE });
        throw error;
      });
  };
}

export function getDailyWorkHoursAllAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.DAILY_WORK_HOURS_ALL_CHART_REQUEST });

    return getDailyWorkHoursAllData(token)
      .then((response) => {
        dispatch({
          type: types.DAILY_WORK_HOURS_ALL_CHART_SUCCESS,
          dailyWorkHours: response,
        });
      })
      .catch((error) => {
        dispatch({ type: types.DAILY_WORK_HOURS_ALL_CHART_FAILURE });
        throw error;
      });
  };
}
