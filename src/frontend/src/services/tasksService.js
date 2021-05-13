import axios from "axios";

export function getTasks(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/tasks/", {
        headers: {
          Authorization: "Bearer " + token,
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

export function getTasksByProject(token, project) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/tasks/?project=" + project, {
        headers: {
          Authorization: "Bearer " + token,
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

export function postTask(token, data) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8005/api/v1/tasks/", data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

export function deleteTask(token, id) {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://127.0.0.1:8005/api/v1/tasks/" + id, {
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
