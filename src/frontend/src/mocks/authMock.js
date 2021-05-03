import mock from "../utils/mock";

const userData = {
  id: "12345",
  email: "demo@bootlab.io",
  name: "Lucy Lavender",
};

mock.onPost("/api/auth/sign-up").reply(() => {
  return [200, userData];
});

mock.onPost("/api/auth/reset-password").reply(() => {
  return [200, userData];
});
