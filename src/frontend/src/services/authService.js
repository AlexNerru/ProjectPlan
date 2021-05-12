import axios from "axios";

export function signIn(credentials) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8001/token/", credentials)
      .then((response) => {
        if (response.status === 200) {
          return response.data.access;
        }
        reject(response.data);
      })
      .then((access) => {
        axios
          .get("http://127.0.0.1:8001/token/user/", {
            headers: {
              Authorization: "Bearer " + access, //the token is a variable which holds the token
            },
          })
          .then((response) => {
            if (response.status === 200) {
              resolve({ access: access, data: response.data });
            }
            reject(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function signUp(credentials) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8001/users/register/", credentials)
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
