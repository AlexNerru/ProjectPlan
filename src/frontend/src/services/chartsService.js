import axios from "axios";

export function getWorkHoursData(token, projectID) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "http://127.0.0.1:8005/api/v1/projects/" + projectID + "/work_hours/",
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
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCostsData(token, projectID) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/projects/" + projectID + "/costs/", {
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

export function getWorkHoursDataAll(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/dashboard/work_hours/", {
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

export function getCostsDataAll(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/dashboard/costs/", {
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

export function getDailyWorkHoursData(token, projectID) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "http://127.0.0.1:8005/api/v1/projects/" + projectID + "/resources/",
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
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getDailyWorkHoursAllData(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://127.0.0.1:8005/api/v1/dashboard/resources/", {
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
