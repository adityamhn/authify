import { apiClient } from "./constants";

export const sendLoginRequest = async (email) => {
  const response = await apiClient.post("/auth", { email });
  return response.data;
};

export const getLoginRequestDetails = async (u) => {
  const response = await apiClient.get("/auth/login?u=" + u);
  return response.data;
};

export const userLogin = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const checkUserLoginStatus = async ({ rsid }) => {
  const response = await apiClient.get(
    "/auth/status",
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.get("/auth/logout");
  return response.data;
};