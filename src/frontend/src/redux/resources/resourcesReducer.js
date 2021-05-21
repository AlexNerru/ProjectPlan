import * as types from "../../constants";

const initialState = {
  resources: [],
  status: "idle",
  project_resources: [],
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.RESOURCES_GET_SUCCESS:
      return {
        ...state,
        resources: actions.resources,
      };

    case types.RESOURCES_GET_PROJECT_SUCCESS:
      return {
        ...state,
        project_resources: actions.resources,
      };

    case types.RESOURCES_ADD_SUCCESS:
      return {
        ...state,
        resources: [...state.resources, actions.resources],
      };

    case types.RESOURCES_DELETE_SUCCESS:
      return {
        ...state,
        resources: state.resources.filter(function (resource) {
          return resource.id !== actions.id;
        }),
      };

    default:
      return state;
  }
}
