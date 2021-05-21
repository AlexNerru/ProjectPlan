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

export function postTask(token, user, project, data) {
  const post_data = {
    creator: user,
    project: project,
    status: 1,
    description: data.description,
    name: data.name,
    planned_finish_date: data.planned_finish_date,
    planned_start_date: data.planned_start_date,
    planned_work_hours: data.planned_work_hours,
    resources: [data.resource],
  };
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8005/api/v1/tasks/", post_data, {
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

export function patchTask(token, id, status, data) {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        "http://127.0.0.1:8005/api/v1/tasks/" + id + "/",
        {
          ...data,
          status: status,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve(id);
        }
        reject();
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
