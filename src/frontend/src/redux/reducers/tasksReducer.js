import * as types from "../../constants";

const initialState = {
  tasks: [],
  status: "idle",
  project_tasks: [],
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.TASKS_GET_SUCCESS:
      return {
        ...state,
        tasks: actions.tasks,
      };

    case types.TASKS_GET_PROJECT_SUCCESS:
      return {
        ...state,
        project_tasks: actions.tasks,
      };

    case types.TASKS_ADD_SUCCESS:
      return {
        ...state,
        tasks: [...state.tasks, actions.tasks],
        project_tasks: [...state.project_tasks, actions.tasks],
      };

    case types.TASKS_DELETE_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.filter(function (task) {
          return task.id !== actions.id;
        }),
      };

    default:
      return state;
  }
}
