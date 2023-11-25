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

export const getAllLogs = async ({
  projectKey,
  q = "",
  rsid,
  ending_before,
  starting_after,
  start_date,
  end_date,
}) => {
  const response = await apiClient.post(
    `/project/logs?q=${q}${
      starting_after ? `&starting_after=${starting_after}` : ""
    }${ending_before ? `&ending_before=${ending_before}` : ""}
    ${
      start_date && end_date
        ? `&start_date=${start_date}&end_date=${end_date}`
        : ""
    }`,
    { projectKey },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
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
