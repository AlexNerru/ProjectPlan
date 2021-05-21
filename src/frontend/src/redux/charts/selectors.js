export const selectWorkHoursLabels = (state) => state.charts.workHours.labels;
export const selectWorkHoursPlan = (state) => state.charts.workHours.plan;
export const selectWorkHoursFact = (state) => state.charts.workHours.fact;

export const selectCostsLabels = (state) => state.charts.costs.labels;
export const selectCostsPlan = (state) => state.charts.costs.plan;
export const selectCostsFact = (state) => state.charts.costs.fact;

export const selectDailyWorkHoursLabels = (state) =>
  state.charts.dailyWorkHours.labels;
export const selectDailyWorkHoursPlan = (state) =>
  state.charts.dailyWorkHours.plan;
export const selectDailyWorkHoursFact = (state) =>
  state.charts.dailyWorkHours.fact;

export const selectResourcesLevelLabels = (state) =>
  state.charts.resourcesLevel.keys;
export const selectResourcesLevelValues = (state) =>
  state.charts.resourcesLevel.values;

export const selectSkillsLabels = (state) => state.charts.skills.keys;
export const selectSkillsValues = (state) => state.charts.skills.values;
