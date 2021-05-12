import * as types from "../../constants";

const initialState = {
  projects: [],
  status: "idle",
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.PROJECTS_GET_SUCCESS:
      return {
        ...state,
        projects: actions.projects,
      };

    case types.PROJECTS_ADD_SUCCESS:
      state.projects.push(actions.projects);
      return state;

    case types.PROJECTS_DELETE_SUCCESS:
      const projects = state.projects.filter(function (project) {
        return project.id !== actions.id;
      });
      state.projects = projects;
      return state;

    default:
      return state;
  }
}
