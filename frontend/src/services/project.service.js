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
