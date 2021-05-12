import * as types from "../../constants";

const initialState = {
  status: "idle",
};

export default function reducer(state = initialState, actions) {
  console.log(actions);
  switch (actions.type) {
    case types.PROJECTS_GET_SUCCESS:
      return {
        ...state,
        projects: actions.projects,
      };

    default:
      return state;
  }
}
