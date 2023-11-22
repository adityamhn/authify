import { Request, Response } from "express";
import ProjectModel from "../models/Project/Project.model";
import TenantModel from "../models/Tenant/Tenant.model";
import ResourceModel from "../models/Resource/Resource.model";
import { getGlobalTenant } from "../utils/services/constants";
import UserDirectoryModel from "../models/UserDirectory/UserDirectory.model";
import RoleModel from "../models/Role/Role.model";

export const checkPermission = async (req: Request, res: Response) => {
  try {
    const { projectId, tenantId } = res.locals;

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.status(400).json({ message: "Project Not Found" });
    }

    const tenant = await TenantModel.findOne({
      _id: tenantId,
      projectId: project._id,
    });

    if (!tenant) {
      return res.status(400).json({ message: "Tenant Not Found" });
    }

    const { user: userKey, resourceAction } = req.body;

    if (!userKey) {
      return res
        .status(400)
        .json({ message: "Invalid payload! User is a required field." });
    }

    if (!resourceAction) {
      return res.status(400).json({
        message: "Invalid payload! resource:action is a required field.",
      });
    }

    const [resourceKey, actionKey] = resourceAction.split(":");

    if (!resourceKey || !actionKey) {
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
      return res.status(400).json({
        message: "Resource not found!",
      });
    }

    const validAction = resource.actions.includes(actionKey);

    if (!validAction) {
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
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const roleAssigned = user.roleAssigned;

    if (!roleAssigned) {
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
      return res.status(400).json({
        message: "User role is invalid!",
      });
    }

    const resourceFound = role.resourcesAttached.find(
      (role) => role.resourceId.toString() === resource._id.toString()
    );

    if (!resourceFound) {
      return res.status(401).json({
        message: "User doesnt have the permission to access this resource.",
      });
    }

    const actionFound = resourceFound.actions.includes(actionKey);

    if (!actionFound) {
      return res.status(401).json({
        message: "User doesnt have the permission to access this action.",
      });
    }

    return res.status(200).json({
      message: "User access is granted",
      result: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
