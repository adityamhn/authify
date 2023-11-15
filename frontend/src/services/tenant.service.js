import { apiClient } from "./constants";

export const getTenantsList = async (projectKey) => {
  const response = await apiClient.post("/tenant/list", {
    projectKey,
  });
  return response.data;
};

export const getTenantsListServerSide = async ({ projectKey, rsid }) => {
  const response = await apiClient.post(
    "/tenant/list",
    {
      projectKey,
    },
    rsid && {
      headers: {
        Cookie: `rsid=${rsid}`,
      },
    }
  );
  return response.data;
};

export const createNewTenant = async ({
  projectKey,
  tenantName,
  tenantKey,
  description,
}) => {
  const response = await apiClient.post("/tenant/create", {
    projectKey,
    tenantName,
    tenantKey,
    description,
  });
  return response.data;
};

export const editTenant = async ({
  projectKey,
  tenantName,
  tenantKey,
  description,
  tenantId,
}) => {
  const response = await apiClient.post("/tenant/edit", {
    projectKey,
    tenantName,
    tenantKey,
    description,
    tenantId,
  });
  return response.data;
};

export const getAllTenants = async ({
  projectKey,
  q = "",
  rsid,
  ending_before,
  starting_after,
}) => {
  const response = await apiClient.post(
    `/tenant/all?q=${q}${
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

export const deleteTenant = async ({ tenantId, projectKey }) => {
  const response = await apiClient.post("/tenant/delete", {
    tenantId,
    projectKey,
  });
  return response.data;
};
