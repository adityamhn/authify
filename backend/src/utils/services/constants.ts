import mongoose from "mongoose";
import TenantModel from "../../models/Tenant/Tenant.model";
import { roleAndResourceRegex } from "../constants";
import ProjectModel from "../../models/Project/Project.model";
import ResourceModel from "../../models/Resource/Resource.model";

export const getGlobalTenant = async (projectId: mongoose.Types.ObjectId) => {
  try {
    const globalTenant = await TenantModel.findOne({
      projectId,
      type: "global",
    });

    if (!globalTenant) {
      throw new Error("Global tenant not found!");
    }

    return globalTenant;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const checkValidTenant = async (
  tenantKey: string,
  projectId: mongoose.Types.ObjectId
) => {
  try {
    const tenant = await TenantModel.findOne({
      tenantKey,
      projectId,
    });

    if (!tenant) {
      throw new Error("Invalid tenant!");
    }

    return tenant;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const validateUploadDataResource = async (
  data: Array<any>,
  projectId: mongoose.Types.ObjectId
) => {
  if (!data.length) {
    throw new Error("No data provided!");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  });

  if (!project) {
    throw new Error("Project not found!");
  }

  const finalData = [];

  for (const item of data) {
    if (!item.resourceName || typeof item.resourceName !== "string") {
      throw new Error(`Invalid resource name!,'${item.resourceName}'`);
    }

    if (
      !item.resourceKey ||
      typeof item.resourceKey !== "string" ||
      !roleAndResourceRegex.test(item.resourceKey)
    ) {
      throw new Error(`Invalid resource key!,'${item.resourceKey}'`);
    }

    if (item.description && typeof item.description !== "string") {
      throw new Error(`Invalid description!,'${item.description}'`);
    }

    if (
      !item.actions ||
      !Array.isArray(item.actions) ||
      !item.actions.length ||
      item.actions.every(
        (action: string) =>
          typeof action !== "string" || !roleAndResourceRegex.test(action)
      )
    ) {
      throw new Error(`Invalid actions for resourceKey,'${item.resourceKey}'`);
    }

    const uniqueActions = [...new Set(item.actions)];

    if (uniqueActions.length !== item.actions.length) {
      throw new Error(
        `Duplicate actions for resourceKey,'${item.resourceKey}'`
      );
    }

    if (
      !item.tenant ||
      typeof item.tenant !== "string" ||
      !roleAndResourceRegex.test(item.tenant)
    ) {
      throw new Error(`Invalid tenant for resourceKey,'${item.resourceKey}'`);
    }

    const validTenant = await checkValidTenant(item.tenant, projectId);

    if (!validTenant) {
      throw new Error(`Invalid tenant for resourceKey,'${item.resourceKey}'`);
    }

    const globalTenant = await getGlobalTenant(projectId);

    const keyCheckQuery: any = {
      projectId,
      resourceKey: item.resourceKey,
      tenantId: { $in: [validTenant._id, globalTenant._id] },
    };

    if (validTenant.type === "global") {
      keyCheckQuery.tenantId = {
        $in: project.tenants.map((tenant) => tenant.tenantId),
      };
    }

    const keyAlreadyExists = await ResourceModel.findOne(keyCheckQuery);

    if (keyAlreadyExists) {
      throw new Error(
        `Resource key already exists for this tenant/global tenant. '${item.resourceKey}'`
      );
    }

    finalData.push({
      projectId: projectId,
      resourceName: item.resourceName,
      resourceKey: item.resourceKey,
      description: item.description,
      actions: item.actions,
      tenantId: validTenant._id,
    });
  }

  return finalData;
};
