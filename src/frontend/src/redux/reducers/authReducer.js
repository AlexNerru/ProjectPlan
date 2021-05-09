import * as types from "../../constants";

const initialState = {
  user: {
    token: undefined,
    id: undefined,
    email: undefined,
    name: undefined,
  },
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        user: {
          token: actions.token,
        },
      };

    case types.AUTH_GET_USER_SUCCESS:
      return {
        ...state,
        user: {
          token: state.user.token,
          id: actions.id,
          email: actions.email,
          name: actions.name,
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
