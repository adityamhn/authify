import { apiClient } from "./constants";

export const getUserDetails = async ({ rsid }) => {
  const response = await apiClient.get(
    "/user",
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const getUserPolicy = async ({ rsid, projectKey, tenantKey }) => {
  const response = await apiClient.post(
    "/user/policy",
    {
      projectKey,
      tenantKey,
    },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const updatePolicy = async ({ policy, tenantKey, projectKey }) => {
  const response = await apiClient.post("/user/update-policy", {
    policy,
    tenantKey,
    projectKey,
  });
  return response.data;
};
