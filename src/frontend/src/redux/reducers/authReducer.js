import * as types from "../../constants";

const initialState = {
  user: {
    token: undefined,
    id: undefined,
    email: undefined,
    first_name: undefined,
    last_name: undefined,
    username: undefined,
  },
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        user: {
          token: actions.token,
          id: actions.id,
          email: actions.email,
          first_name: actions.first_name,
          last_name: actions.last_name,
          username: actions.username,
        },
      };

    case types.AUTH_SIGN_OUT:
      return {
        ...state,
        user: undefined,
      };

    default:
      return state;
  }
}
