import * as types from "../../constants";
import {
  signIn as authSignIn,
  signUp as authSignUp,
} from "../../services/authService";

export function signIn(credentials) {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_IN_REQUEST });

    return authSignIn(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_SIGN_IN_SUCCESS,
          token: response.access,
          id: response.data.id,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          username: response.data.username,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_SIGN_IN_FAILURE });
        throw error;
      });
  };
}

export function signUp(credentials) {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_UP_REQUEST });

    return authSignUp(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_SIGN_UP_SUCCESS,
          id: response.id,
          email: response.email,
          name: response.name,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_SIGN_UP_FAILURE });
        throw error;
      });
  };
}

export function signOut() {
  return async (dispatch) => {
    dispatch({
      type: types.AUTH_SIGN_OUT,
    });
  };
}
