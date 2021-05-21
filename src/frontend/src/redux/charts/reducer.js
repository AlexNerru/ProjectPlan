import * as types from "../../constants";

const initialState = {
  workHours: {},
  dailyWorkHours: {},
  costs: {},
  resourcesLevel: {},
  skills: {},
  status: "idle",
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.WORK_HOURS_CHART_SUCCESS:
      return {
        ...state,
        workHours: actions.workHours,
      };

    case types.COSTS_CHART_SUCCESS:
      return {
        ...state,
        costs: actions.costs,
      };

    case types.WORK_HOURS_ALL_CHART_SUCCESS:
      return {
        ...state,
        workHours: actions.workHours,
      };

    case types.COSTS_ALL_CHART_SUCCESS:
      return {
        ...state,
        costs: actions.costs,
      };

    case types.DAILY_WORK_HOURS_CHART_SUCCESS:
      return {
        ...state,
        dailyWorkHours: actions.dailyWorkHours,
      };

    case types.DAILY_WORK_HOURS_ALL_CHART_SUCCESS:
      return {
        ...state,
        dailyWorkHours: actions.dailyWorkHours,
      };

    case types.RESOURCES_LEVEL_CHART_SUCCESS:
      return {
        ...state,
        resourcesLevel: actions.resourcesLevel,
      };

    case types.SKILLS_CHART_SUCCESS:
      return {
        ...state,
        skills: actions.skills,
      };

    default:
      return state;
  }
}
