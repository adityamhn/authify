import { apiClient } from "./constants";

export const checkValidProject = async ({ projectKey, rsid }) => {
  const response = await apiClient.post(
    "/project/check",
    { projectKey },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const createNewProject = async ({ projectKey, projectName }) => {
  const response = await apiClient.post("/project/create", {
    projectKey,
    projectName,
  });
  return response.data;
};

export const createNewApiKey = async ({ projectKey, identifier }) => {
  const response = await apiClient.post("/project/api-key/create", {
    projectKey,
    identifier,
  });
  return response.data;
};

export const getAllApiKeys = async ({ projectKey, rsid }) => {
  const response = await apiClient.post(
    `/project/api-key/all`,
    { projectKey },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};
