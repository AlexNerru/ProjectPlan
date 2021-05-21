import axios from "axios";
import Cookies from "universal-cookie";
import history from "../routes/history";

const instance = axios.create({
  validateStatus: (status) => status < 500,
});

instance.interceptors.response.use(
  (response) => {
    if (
      response &&
      response.status &&
      (response.status === 401 || response.status === 403)
    ) {
      const cookies = new Cookies();
      cookies.remove("token", { path: "/" });
      cookies.remove("id", { path: "/" });

      history.push("/auth/sign-in/");
      history.go(0);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
