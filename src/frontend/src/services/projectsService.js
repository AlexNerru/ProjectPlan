import axios from "axios";

export function getProjects(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8002/api/v1/projects/", {
        headers: {
          Authorization: "Bearer " + token, //the token is a variable which holds the token
        },
      })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postProjects(token, user, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "http://127.0.0.1:8002/api/v1/projects/",
        { ...data, company: 1, owner: user, participants: [user] },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          console.log(response);
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
