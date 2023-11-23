import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ResourceModel from "../models/Resource/Resource.model";
import { roleAndResourceRegex } from "../utils/constants";
import ProjectModel from "../models/Project/Project.model";
import { advanceFilter } from "../utils/filters";
import TenantModel, { TenantDoc } from "../models/Tenant/Tenant.model";
import mongoose from "mongoose";
import { decodeQuery } from "../utils/queryParser";
import RoleModel from "../models/Role/Role.model";
import { getGlobalTenant } from "../utils/services/constants";

// checked
export const createNewResource = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    const { resourceName, resourceKey, actions, description, tenantId } =
      req.body;

    if (
      !resourceName ||
      !resourceKey ||
      !actions ||
      actions.length === 0 ||
      !tenantId
    ) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const validTenant = await TenantModel.findOne({
      _id: tenantId,
      projectId: project._id,
    });

    if (!validTenant) {
      return res.status(400).json({ message: "Invalid tenant" });
    }

    const resourceKeyRegex = roleAndResourceRegex;

    if (!resourceKeyRegex.test(resourceKey)) {
      return res.status(400).json({
        message:
          "Resource key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyCheckQuery: any = {
      projectId: project._id,
      resourceKey,
      tenantId: { $in: [validTenant._id, globalTenant._id] },
    };

    if (validTenant.type === "global") {
      keyCheckQuery.tenantId = {
        $in: project.tenants.map((tenant) => tenant.tenantId),
      };
    }

    const keyAlreadyExists = await ResourceModel.findOne(keyCheckQuery);

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: validTenant.type === "global" ? "A resource with this key already exists under another tenant. Please use a unique key for global tenant or choose a different tenant." : "Resource key already exists for this tenant/global tenant.",
      });
    }

    for (const action of actions) {
      if (!resourceKeyRegex.test(action)) {
        return res.status(400).json({
          message:
            "Action must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
        });
      }
    }

    const uniqueActions = [...new Set(actions)];
    if (uniqueActions.length !== actions.length) {
      return res
        .status(400)
        .json({ message: "Actions must be unique for a resource." });
    }

    const newResource = new ResourceModel({
      projectId: project._id,
      resourceName,
      resourceKey,
      description,
      tenantId: validTenant._id,
      actions: actions,
    });

    await newResource.save();

    return res.status(200).json({
      message: "Resource created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// checked
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    let { q = "", starting_after = false, ending_before = false } = req.query;
    q = decodeQuery(q.toString());

    const { filters, searchTerm } = advanceFilter({
      q,
      toFind: ["action", "tenant"],
    });

    let tenantIds = [];
    if (filters?.tenant?.length > 0) {
      tenantIds = await TenantModel.find(
        {
          projectId: project._id,
          tenantKey: { $in: filters.tenant },
        },
        {
          _id: 1,
        }
      );

      if (tenantIds.length > 0) {
        tenantIds = tenantIds.map((tenant: TenantDoc) => tenant._id);
      }
    }

    const query: any = {
      projectId: project._id,
    };

    const sort: any = {
      _id: 1,
    };

    if (filters?.action?.length > 0) {
      query["actions"] = { $in: filters.action };
    }

    if (filters?.tenant?.length > 0) {
      query.tenantId = { $in: tenantIds };
    }

    if (searchTerm) {
      query.$or = [
        {
          resourceName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          resourceKey: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    const totalResources = await ResourceModel.find(query, {
      resourceKey: 1,
    }).countDocuments();

    const lastDoc = await ResourceModel.findOne(query, {
      resourceKey: 1,
    }).sort({ _id: -1 });

    const firstDoc = await ResourceModel.findOne(query, {
      resourceKey: 1,
    }).sort({ _id: 1 });

    if (starting_after && lastDoc?.resourceKey !== starting_after) {
      const resource = await ResourceModel.findOne({
        resourceKey: starting_after,
        projectId: project._id,
      });

      if (!resource) {
        return res.status(400).json({
          message: `Resource not Found for starting_after '${starting_after}'`,
        });
      }

      query._id = {
        $gt: resource._id,
      };

      sort._id = 1;
    }

    if (ending_before && firstDoc?.resourceKey !== ending_before) {
      const resource = await ResourceModel.findOne({
        resourceKey: ending_before,
        projectId: project._id,
      });

      if (!resource) {
        return res.status(400).json({
          message: `Resource not Found for ending_before '${ending_before}'`,
        });
      }

      query._id = {
        $lt: resource._id,
      };

      sort._id = -1;
    }

    interface ReturnType {
      _id: mongoose.Types.ObjectId;
      key: string;
      resourceName: string;
      resourceKey: string;
      description: string;
      actions: string[];
      tenantName: string;
      tenantKey: string;
    }

    const resources = await ResourceModel.find(query, {
      resourceName: 1,
      resourceKey: 1,
      description: 1,
      actions: 1,
      tenantId: 1,
    })
      .limit(25)
      .sort(sort);

    const firstpage =
      resources[0].resourceKey === firstDoc?.resourceKey ? true : false;
    const lastpage =
      resources[resources.length - 1].resourceKey === lastDoc?.resourceKey
        ? true
        : false;

    const returnResources: ReturnType[] = [];

    for (const resource of resources) {
      const tenant = await TenantModel.findOne(
        {
          _id: resource.tenantId,
        },
        {
          tenantName: 1,
          tenantKey: 1,
        }
      );

      if (!tenant) {
        return res.status(400).json({
          message: `Tenant not Found for resource '${resource.resourceKey}'`,
        });
      }

      const returnResource: ReturnType = {
        _id: resource._id,
        key: resource._id,
        resourceName: resource.resourceName,
        resourceKey: resource.resourceKey,
        description: resource.description,
        actions: resource.actions,
        tenantName: tenant.tenantName,
        tenantKey: tenant.tenantKey,
      };

      returnResources.push(returnResource);
    }

    return res.status(200).json({
      message: "Resources fetched successfully",
      resources: returnResources,
      totalResources,
      first: firstpage ? true : false,
      last: lastpage ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Need to check the error when resource being edited is attached to some roles
export const editResource = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    const { resourceId, resourceName, resourceKey, actions, description } =
      req.body;

    if (
      !resourceId ||
      !resourceName ||
      !resourceKey ||
      !actions ||
      actions.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const resource = await ResourceModel.findOne({
      _id: resourceId,
      projectId: project._id,
    });

    if (!resource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const resourceKeyRegex = roleAndResourceRegex;

    if (!resourceKeyRegex.test(resourceKey)) {
      return res.status(400).json({
        message:
          "Resource key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyAlreadyExists = await ResourceModel.findOne({
      _id: { $ne: resourceId },
      projectId: project._id,
      resourceKey,
      tenantId: { $in: [resource.tenantId, globalTenant._id] },
    });

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: "Resource key already exists for this tenant/global tenant",
      });
    }

    for (const action of actions) {
      if (!resourceKeyRegex.test(action)) {
        return res.status(400).json({
          message:
            "Action must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
        });
      }
    }

    const uniqueActions = [...new Set(actions)];
    if (uniqueActions.length !== actions.length) {
      return res
        .status(400)
        .json({ message: "Actions must be unique for a resource." });
    }

    const actionsRemoved = resource.actions.filter(
      (actionDoc) => !actions.includes(actionDoc)
    );

    const rolesWithResource = await RoleModel.find({
      projectId: project._id,
      "resourcesAttached.resourceId": resource._id,
      "resourcesAttached.actions": { $in: actionsRemoved },
    });

    if (rolesWithResource.length > 0) {
      return res.status(400).json({
        message:
          "The Resource/Action is attached to some roles. Please remove them to update the resource.",
      });
    }

    resource.resourceName = resourceName;
    resource.resourceKey = resourceKey;
    resource.description = description;
    resource.actions = actions;

    await resource.save();

    return res.status(200).json({
      message: "Resource updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Need to check after attaching the resource to a role
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;
    const { resourceId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    if (!resourceId) {
      return res.status(400).json({ message: "Resource Id is required" });
    }

    const resource = await ResourceModel.findOne({
      _id: resourceId,
      projectId: project._id,
    });

    if (!resource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const rolesWithResource = await RoleModel.find({
      projectId: project._id,
      "resourcesAttached.resourceId": resource._id,
    });

    // if (rolesWithResource.length > 0) {
    //   for (const role of rolesWithResource) {
    //     const updatedResourcesAttached = role.resourcesAttached.filter(
    //       (resourceDoc) =>
    //         resourceDoc.resourceId.toString() !== resource._id.toString()
    //     );

    //     role.resourcesAttached = updatedResourcesAttached;

    //     await role.save();
    //   }
    // }

    if (rolesWithResource.length > 0) {
      return res.status(400).json({
        message:
          "The Resource is attached to some roles. Please remove them to delete this resource.",
      });
    }

    await resource.deleteOne();

    return res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Need to check after attaching the resource to a role
export const deleteAction = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;
    const { resourceId, action } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    if (!resourceId) {
      return res.status(400).json({ message: "Resource Id is required" });
    }

    const resource = await ResourceModel.findOne({
      _id: resourceId,
      projectId: project._id,
    });

    if (!resource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    const actionIndex = resource.actions.findIndex(
      (actionDoc) => actionDoc === action
    );

    if (actionIndex === -1) {
      return res.status(400).json({ message: "Action not found" });
    }

    const rolesWithResource = await RoleModel.find({
      projectId: project._id,
      "resourcesAttached.resourceId": resource._id,
      "resourcesAttached.actions": { $in: [action] },
    });

    if (rolesWithResource.length > 0) {
      return res.status(400).json({
        message:
          "The Action is attached to some roles. Please remove them to delete this action.",
      });
    }

    resource.actions.splice(actionIndex, 1);

    await resource.save();

    return res.status(200).json({
      message: "Action deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// checked
export const addAction = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;
    const { resourceId, action } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    if (!resourceId) {
      return res.status(400).json({ message: "Resource Id is required" });
    }

    const resource = await ResourceModel.findOne({
      _id: resourceId,
      projectId: project._id,
    });

    if (!resource) {
      return res.status(400).json({ message: "Resource not found" });
    }

    if (!roleAndResourceRegex.test(action)) {
      return res.status(400).json({
        message:
          "Action must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const actionIndex = resource.actions.findIndex(
      (actionDoc) => actionDoc === action
    );

    if (actionIndex !== -1) {
      return res.status(400).json({ message: "Action already exists" });
    }

    resource.actions.push(action);

    await resource.save();

    return res.status(200).json({
      message: "Action added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getResourcesListTenant = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    if (!projectId) {
      return res.status(401).json({ message: "project Key Not Found!" });
    }

    const project = await ProjectModel.findOne({
      _id: projectId,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Project not found." });
    }

    const { tenantKey } = req.body;

    const tenant = await TenantModel.findOne({
      projectId: project._id,
      tenantKey,
    });

    if (!tenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    const tenantsToFetch = [tenant._id];

    if (tenant.type !== "global") {
      const globalTenant = await getGlobalTenant(project._id);

      tenantsToFetch.push(globalTenant._id);
    }

    const resources = await ResourceModel.find(
      {
        projectId: project._id,
        tenantId: { $in: tenantsToFetch },
      },
      {
        resourceKey: 1,
        resourceName: 1,
        actions: 1,
        _id: 1,
      }
    );

    return res.status(200).json({
      message: "Resources fetched successfully",
      resources,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
