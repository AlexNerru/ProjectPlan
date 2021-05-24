import axios from "axios";

export function getResources(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8003/api/v1/resources/", {
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

export function getResourcesByProject(token, project) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8003/api/v1/resources/?project=" + project, {
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

export function postResource(token, data) {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8003/api/v1/resources/", data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
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

export function patchResource(token, id, data) {
  return new Promise((resolve, reject) => {
    axios
      .patch("http://127.0.0.1:8003/api/v1/resources/" + id + "/", data, {
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

export function deleteResource(token, id) {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://127.0.0.1:8003/api/v1/resources/" + id + "/", {
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
