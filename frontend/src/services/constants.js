import axios from "axios";

export const BACKEND_URL = "http://127.0.0.1:8080/api";

export const roleAndResourceRegex = /^[a-z0-9-_]+$/;
export const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const useServerSide = async (fn) => {
  try {
    const data = await fn();

    return { data };
  } catch (error) {
    return { error: error.response.data };
  }
};
