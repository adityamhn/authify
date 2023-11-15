import { apiClient } from "./constants";

export const createNewResource = async ({
  resourceName,
  resourceKey,
  description,
  actions,
  projectKey,
  tenantId,
}) => {
  const response = await apiClient.post("/resource/create", {
    resourceName,
    resourceKey,
    description,
    actions,
    tenantId,
    projectKey,
  });
  return response.data;
};

export const editResource = async ({
  resourceId,
  resourceName,
  resourceKey,
  description,
  actions,
  projectKey,
}) => {
  const response = await apiClient.post("/resource/edit", {
    resourceId,
    resourceName,
    resourceKey,
    description,
    actions,
    projectKey,
  });
  return response.data;
};

export const deleteResource = async ({ resourceId, projectKey }) => {
  const response = await apiClient.post("/resource/delete", {
    resourceId,
    projectKey,
  });
  return response.data;
};

export const deleteAction = async ({ resourceId, projectKey, action }) => {
  const response = await apiClient.post("/resource/delete-action", {
    resourceId,
    projectKey,
    action,
  });
  return response.data;
};

export const addAction = async ({ resourceId, projectKey, action }) => {
  const response = await apiClient.post("/resource/add-action", {
    resourceId,
    projectKey,
    action,
  });
  return response.data;
};

export const getAllResource = async ({
  projectKey,
  q = "",
  rsid,
  ending_before,
  starting_after,
}) => {
  const response = await apiClient.post(
    `/resource/all?q=${q}${
      starting_after ? `&starting_after=${starting_after}` : ""
    }${ending_before ? `&ending_before=${ending_before}` : ""}`,
    { projectKey },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const getResourceList = async ({ projectKey, tenantKey }) => {
  const response = await apiClient.post("/resource/list", {
    projectKey,
    tenantKey
  });
  return response.data;
};
