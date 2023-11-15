import { apiClient } from "./constants";

export const getUserOnboarding = async ({ rsid }) => {
  const response = await apiClient.get(
    "/onboarding",
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const updateUserOnboarding = async ({ step, data }) => {
  const response = await apiClient.post("/onboarding", {
    step,
    data,
  });
  return response.data;
};
