import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Add interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login"; // or your login route
    }
    return Promise.reject(error);
  }
);

export default api;
