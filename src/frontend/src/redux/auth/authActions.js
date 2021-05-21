import * as types from "../../constants";
import {
  getUser,
  signIn as authSignIn,
  signUp as authSignUp,
} from "../../services/authService";

export function signInAction(credentials) {
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

export function getUserAction(token) {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_GET_USER_REQUEST });

    return getUser(token)
      .then((response) => {
        dispatch({
          type: types.AUTH_GET_USER_SUCCESS,
          id: response.id,
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_GET_USER_FAILURE });
        throw error;
      });
  };
}

export function signUpAction(credentials) {
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
  return (dispatch) => {
    dispatch({
      type: types.AUTH_SIGN_OUT,
    });
  };
}
