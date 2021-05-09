import axios from "axios";

export function getProjects(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8001/api/v1/projects",  {
        headers: {
          Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }})
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          resolve(response.data);
        }
        reject(response.data);
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
