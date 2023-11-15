import { apiClient } from "./constants";

export const createNewRole = async ({
  roleName,
  roleKey,
  description,
  projectKey,
  tenantId,
}) => {
  const response = await apiClient.post("/role/create", {
    roleName,
    roleKey,
    description,
    tenantId,
    projectKey,
  });
  return response.data;
};

export const editRole = async ({
  roleId,
  roleName,
  roleKey,
  description,
  projectKey,
}) => {
  const response = await apiClient.post("/role/edit", {
    roleId,
    roleName,
    roleKey,
    description,
    projectKey,
  });
  return response.data;
};

export const deleteRole = async ({ roleId, projectKey }) => {
  const response = await apiClient.post("/role/delete", {
    roleId,
    projectKey,
  });
  return response.data;
};

export const getAllRoles = async ({
  projectKey,
  q = "",
  rsid,
  ending_before,
  starting_after,
}) => {
  const response = await apiClient.post(
    `/role/all?q=${q}${
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

export const getResourcesAttached = async ({ roleId, projectKey }) => {
  const response = await apiClient.post("/role/get-attached-resources", {
    roleId,
    projectKey,
  });
  return response.data;
};

export const attachResources = async ({ roleId, actions, projectKey }) => {
  const response = await apiClient.post("/role/attach-resource", {
    roleId,
    actions,
    projectKey,
  });
  return response.data;
};

export const getRolesList = async ({ projectKey, tenantId }) => {
  const response = await apiClient.post("/role/list", {
    projectKey,
    tenantId
  });
  return response.data;
};
