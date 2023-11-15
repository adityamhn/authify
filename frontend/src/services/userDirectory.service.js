import { apiClient } from "./constants";

export const createNewUser = async ({
  userName,
  userKey,
  email,
  projectKey,
  tenantId,
  assignRole,
}) => {
  const response = await apiClient.post("/user-directory/create", {
    userName,
    userKey,
    email,
    projectKey,
    tenantId,
    assignRole,
  });
  return response.data;
};

export const editUser = async ({
  userDirectoryId,
  userName,
  userKey,
  email,
  projectKey,
  assignRole,
}) => {
  const response = await apiClient.post("/user-directory/edit", {
    userDirectoryId,
    userName,
    userKey,
    email,
    projectKey,
    assignRole,
  });
  return response.data;
};

export const deleteUser = async ({ userDirectoryId, projectKey }) => {
  const response = await apiClient.post("/user-directory/delete", {
    userDirectoryId,
    projectKey,
  });
  return response.data;
};

export const getAllUsers = async ({
  projectKey,
  q = "",
  rsid,
  ending_before,
  starting_after,
}) => {
  const response = await apiClient.post(
    `/user-directory/all?q=${q}${
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