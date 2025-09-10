import axios from "axios";
import Auth from "./auth";

const API_URL = import.meta.env.VITE_API_URL

const Api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Tenant: "root",
  },
});

Api.interceptors.request.use(
  (config) => {
    if (Auth.isAuthenticated()) {
      config.headers["Authorization"] = `Bearer ${Auth.getToken()}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    console.log(error);

    if (error.response.status === 401) {
      // Token is invalid or expired, redirect to login page
      Auth.logOut();
    }

    if (error.response.status === 403) {
      // Token is invalid or expired, redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default Api;


export async function login(data: { email: string, password: string }) {
  return axios.post(`auth/login`, data, { withCredentials: true })
}

export async function refresh() {
  return axios.post(`auth/refresh`, {}, { withCredentials: true })
}

