import { Request, Response } from "express";
import ProjectModel from "../models/Project/Project.model";
import TenantModel from "../models/Tenant/Tenant.model";
import ResourceModel from "../models/Resource/Resource.model";
import { getGlobalTenant } from "../utils/services/constants";
import UserDirectoryModel from "../models/UserDirectory/UserDirectory.model";
import RoleModel from "../models/Role/Role.model";
import { allowAccessToUser, updateDenyReason } from "../utils/services/logs";

export const checkPermission = async (req: Request, res: Response) => {
  try {
    const { projectId, logId } = res.locals;

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      await updateDenyReason(logId, "Project Not Found");
      return res.status(400).json({ message: "Project Not Found" });
    }

    const { tenant: tenantKey } = req.body;

    const tenant = await TenantModel.findOne({
      tenantKey,
      projectId: project._id,
    });

    if (!tenant) {
      await updateDenyReason(logId, "Invalid Tenant Key!");
      return res.status(401).json({ message: "Invalid Tenant Key!" });
    }

    const { user: userKey, resourceAction } = req.body;

    if (!userKey) {
      await updateDenyReason(
        logId,
        "Invalid payload! User is a required field."
      );
      return res
        .status(400)
        .json({ message: "Invalid payload! User is a required field." });
    }

    if (!resourceAction) {
      await updateDenyReason(
        logId,
        "Invalid payload! resource:action is a required field."
      );
      return res.status(400).json({
        message: "Invalid payload! resource:action is a required field.",
      });
    }

    const [resourceKey, actionKey] = resourceAction.split(":");

    if (!resourceKey || !actionKey) {
      await updateDenyReason(
        logId,
        "Invalid payload format! resource:action should be in the correct format."
      );
      return res.status(400).json({
        message:
          "Invalid payload format! resource:action should be in the correct format.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const resource = await ResourceModel.findOne({
      projectId: project._id,
      resourceKey: resourceKey,
      tenantId: { $in: [tenant._id, globalTenant._id] },
    });

    if (!resource) {
      await updateDenyReason(logId, "Resource not found!");
      return res.status(400).json({
        message: "Resource not found!",
      });
    }

    const validAction = resource.actions.includes(actionKey);

    if (!validAction) {
      await updateDenyReason(
        logId,
        "Invalid Action! Resource doesnt have this action."
      );
      return res.status(400).json({
        message: "Invalid Action! Resource doesnt have this action.",
      });
    }

    const user = await UserDirectoryModel.findOne({
      userKey: userKey,
      projectId: project._id,
      tenantId: { $in: [tenant._id, globalTenant._id] },
    });

    if (!user) {
      await updateDenyReason(logId, "User not found!");
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const roleAssigned = user.roleAssigned;

    if (!roleAssigned) {
      await updateDenyReason(logId, "User doesn't have a role assigned!");
      return res.status(400).json({
        message: "User doesn't have a role assigned!",
      });
    }

    const role = await RoleModel.findOne({
      _id: roleAssigned,
      projectId: project._id,
      tenantId: { $in: [tenant._id, globalTenant._id] },
    });

    if (!role) {
      await updateDenyReason(logId, "User role is invalid!");
      return res.status(400).json({
        message: "User role is invalid!",
      });
    }

    const resourceFound = role.resourcesAttached.find(
      (role) => role.resourceId.toString() === resource._id.toString()
    );

    if (!resourceFound) {
      await updateDenyReason(
        logId,
        "User doesnt have the permission to access this resource."
      );
      return res.status(401).json({
        message: "User doesnt have the permission to access this resource.",
      });
    }

    const actionFound = resourceFound.actions.includes(actionKey);

    if (!actionFound) {
      await updateDenyReason(
        logId,
        "User doesnt have the permission to access this action."
      );
      return res.status(401).json({
        message: "User doesnt have the permission to access this action.",
      });
    }

    await allowAccessToUser(logId);
    return res.status(200).json({
      message: "User access is granted",
      result: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
