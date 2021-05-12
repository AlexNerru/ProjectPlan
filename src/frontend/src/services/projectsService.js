import axios from "axios";

export default function getProjects(token) {
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
