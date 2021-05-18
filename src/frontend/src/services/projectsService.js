import axios from "../utils/axios";

export function getProjects(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8002/api/v1/projects/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => response.data);
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
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteProject(token, id) {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://127.0.0.1:8002/api/v1/projects/" + id + "/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          resolve(id);
        }
        reject();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function patchProject(token, id, data) {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        "http://127.0.0.1:8002/api/v1/projects/" + id + "/",
        {
          ...data,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
