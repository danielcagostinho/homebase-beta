import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  },
);
