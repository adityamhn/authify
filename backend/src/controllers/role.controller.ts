import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import { roleAndResourceRegex } from "../utils/constants";
import RoleModel, { resourcesAttachedDoc } from "../models/Role/Role.model";
import ProjectModel from "../models/Project/Project.model";
import { decodeQuery } from "../utils/queryParser";
import { advanceFilter } from "../utils/filters";
import TenantModel, { TenantDoc } from "../models/Tenant/Tenant.model";
import ResourceModel, { ResourceDoc } from "../models/Resource/Resource.model";
import mongoose from "mongoose";
import UserDirectoryModel from "../models/UserDirectory/UserDirectory.model";
import { getGlobalTenant } from "../utils/services/constants";

export const createNewRole = async (req: Request, res: Response) => {
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

    const { roleName, roleKey, description, tenantId } = req.body;

    if (!roleName || !roleKey || !tenantId) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const validTenant = await TenantModel.findOne({
      projectId: project._id,
      _id: tenantId,
    });


    if (!validTenant) {
      return res.status(400).json({ message: "Invalid tenant" });
    }

    const roleKeyRegex = roleAndResourceRegex;

    if (!roleKeyRegex.test(roleKey)) {
      return res.status(400).json({
        message:
          "Role key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyCheckQuery: any = {
      projectId: project._id,
      roleKey,
      tenantId: { $in: [validTenant._id, globalTenant._id] },
    };

    if (validTenant.type === "global") {
      keyCheckQuery.tenantId = {
        $in: project.tenants.map((tenant) => tenant.tenantId),
      };
    }



    const keyAlreadyExists = await RoleModel.findOne(keyCheckQuery);

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: validTenant.type === "global" ? "A role with this key already exists under another tenant. Please use a unique key for the global tenant or choose a different tenant." : "Role key already exists for this tenant/global tenant",
      });
    }

    const newRole = new RoleModel({
      projectId: project._id,
      roleName,
      roleKey,
      description,
      tenantId,
    });

    await newRole.save();

    return res.status(200).json({ message: "Role created successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editRole = async (req: Request, res: Response) => {
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

    const { roleId, roleName, roleKey, description } = req.body;

    if (!roleId || !roleName || !roleKey) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const role = await RoleModel.findOne({
      _id: roleId,
      projectId: project._id,
    });

    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    const roleKeyRegex = roleAndResourceRegex;

    if (!roleKeyRegex.test(roleKey)) {
      return res.status(400).json({
        message:
          "Role key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyAlreadyExists = await RoleModel.findOne({
      _id: { $ne: roleId },
      projectId: project._id,
      roleKey,
      tenantId: { $in: [role.tenantId, globalTenant._id] },
    });

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: "Role key already exists for this tenant/global tenant",
      });
    }

    role.roleName = roleName;
    role.roleKey = roleKey;
    role.description = description;

    await role.save();

    return res.status(200).json({ message: "Role updated successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { userId, projectId } = res.locals;
    const { roleId } = req.body;

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

    if (!roleId) {
      return res.status(400).json({ message: "Role Id is required" });
    }

    const role = await RoleModel.findOne({
      _id: roleId,
      projectId: project._id,
    });

    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    const roleInUse = await UserDirectoryModel.find({
      roleAssigned: role._id,
    });

    // if (roleInUse.length > 0) {
    //   for (const user of roleInUse) {
    //     user.roleAssigned = undefined;
    //     await user.save();
    //   }
    // }

    if (roleInUse.length > 0) {
      return res.status(400).json({
        message: `Role is in use by ${roleInUse.length} users. Unassign the role from users and try again.`,
      });
    }

    await role.deleteOne();

    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
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
      toFind: ["resource", "tenant"],
    });

    console.log(filters);

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

    let resourceIds = [];
    if (filters?.resource?.length > 0) {
      resourceIds = await ResourceModel.find(
        {
          projectId: project._id,
          resourceKey: { $in: filters.resource },
        },
        {
          _id: 1,
        }
      );

      if (resourceIds.length > 0) {
        resourceIds = resourceIds.map((resource: ResourceDoc) => resource._id);
      }
    }


    const query: any = {
      projectId: project._id,
    };

    const sort: any = {
      _id: 1,
    };

    if (filters?.tenant?.length > 0) {
      query.tenantId = { $in: tenantIds };
    }

    if (filters?.resource?.length > 0) {
      query.resourcesAttached = {
        $elemMatch: {
          resourceId: {
            $in: resourceIds,
          },
        },
      };
    }

    if (searchTerm) {
      query.$or = [
        {
          roleName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          roleKey: {
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

    const totalRoles = await RoleModel.countDocuments(query);

    const lastDoc = await RoleModel.findOne(query, {
      roleKey: 1,
    }).sort({ _id: -1 });

    const firstDoc = await RoleModel.findOne(query, {
      roleKey: 1,
    }).sort({ _id: 1 });

    if (starting_after && lastDoc?.roleKey !== starting_after) {
      const role = await RoleModel.findOne({
        roleKey: starting_after,
        projectId: project._id,
      });

      if (!role) {
        return res.status(400).json({
          message: `Role not Found for starting_after '${starting_after}'`,
        });
      }

      query._id = {
        $gt: role._id,
      };

      sort._id = 1;
    }

    if (ending_before && firstDoc?.roleKey !== ending_before) {
      const role = await RoleModel.findOne({
        roleKey: ending_before,
        projectId: project._id,
      });

      if (!role) {
        return res.status(400).json({
          message: `Role not Found for ending_before '${ending_before}'`,
        });
      }

      query._id = {
        $lt: role._id,
      };

      sort._id = -1;
    }

    interface ReturnType {
      _id: mongoose.Types.ObjectId;
      key: string;
      roleName: string;
      roleKey: string;
      description: string;
      tenantName: string;
      tenantKey: string;
    }

    const roles = await RoleModel.find(query, {
      roleName: 1,
      roleKey: 1,
      description: 1,
      tenantId: 1,
    })
      .limit(25)
      .sort(sort);

    const firstpage = roles[0].roleKey === firstDoc?.roleKey ? true : false;
    const lastpage =
      roles[roles.length - 1].roleKey === lastDoc?.roleKey ? true : false;

    const returnRoles: ReturnType[] = [];

    for (const role of roles) {
      const tenant = await TenantModel.findOne(
        {
          _id: role.tenantId,
        },
        {
          tenantName: 1,
          tenantKey: 1,
        }
      );

      if (!tenant) {
        return res.status(400).json({
          message: `Tenant not Found for role '${role.roleKey}'`,
        });
      }
      const returnRole: ReturnType = {
        _id: role._id,
        key: role._id,
        roleName: role.roleName,
        roleKey: role.roleKey,
        description: role.description,
        tenantName: tenant.tenantName,
        tenantKey: tenant.tenantKey,
      };

      returnRoles.push(returnRole);
    }
    return res.status(200).json({
      message: "Roles fetched successfully",
      roles: returnRoles,
      totalRoles,
      first: firstpage ? true : false,
      last: lastpage ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const attachResource = async (req: Request, res: Response) => {
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

    const validTenants = project.tenants.map((tenant) => tenant.tenantId);

    const { roleId, actions = [] } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "Required details are missing." });
    }

    const role = await RoleModel.findOne({
      _id: roleId,
      projectId: project._id,
      tenantId: { $in: validTenants },
    });

    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const attachedResources: resourcesAttachedDoc[] = [];

    for (const a of actions) {
      const [resourceKey, action] = a.split(":");

      const resource = await ResourceModel.findOne({
        projectId: project._id,
        resourceKey,
        tenantId: { $in: [role.tenantId, globalTenant._id] },
      });

      if (!resource) {
        return res
          .status(400)
          .json({ message: `Resource not found '${resourceKey}'` });
      }

      const validAction = resource.actions.find(
        (resourceAction) => resourceAction === action
      );

      if (!validAction) {
        return res.status(400).json({
          message: `Invalid action for resource '${resource.resourceKey}'`,
        });
      }

      const resourceAlreadyAdded = attachedResources.find(
        (attachedResource) =>
          attachedResource.resourceId.toString() === resource._id.toString()
      );

      if (resourceAlreadyAdded) {
        resourceAlreadyAdded.actions.push(action);
      } else {
        attachedResources.push({
          resourceId: resource._id,
          actions: [action],
        });
      }
    }

    role.resourcesAttached = attachedResources;

    await role.save();

    return res
      .status(200)
      .json({ message: "Resources attached successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAttachedResources = async (req: Request, res: Response) => {
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
    const validTenants = project.tenants.map((tenant) => tenant.tenantId);

    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "Role Id is required" });
    }

    const role = await RoleModel.findOne({
      _id: roleId,
      projectId: project._id,
      tenantId: { $in: validTenants },
    });

    if (!role) {
      return res.status(400).json({ message: "Role not found" });
    }

    const resourcesAttached: any[] = [];

    const globalTenant = await getGlobalTenant(project._id);

    for (const resource of role.resourcesAttached) {
      const resourceDetails = await ResourceModel.findOne({
        _id: resource.resourceId,
        projectId: project._id,
        tenantId: { $in: [role.tenantId, globalTenant._id] },
      });

      if (!resourceDetails) {
        return res.status(400).json({
          message: `Resource not found for role '${role.roleKey}'`,
        });
      }

      resourcesAttached.push({
        resourceKey: resourceDetails.resourceKey,
        actions: resource.actions,
      });
    }

    return res.status(200).json({
      message: "Resources attached fetched successfully",
      resourcesAttached,
      roleKey: role.roleKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRolesListTenant = async (req: Request, res: Response) => {
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

    const { tenantId } = req.body;

    const tenant = await TenantModel.findOne({
      projectId: project._id,
      _id: tenantId,
    });

    if (!tenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const roles = await RoleModel.find(
      {
        projectId: project._id,
        tenantId: { $in: [tenant._id, globalTenant._id] },
      },
      {
        roleKey: 1,
        roleName: 1,
        _id: 1,
      }
    );

    return res.status(200).json({
      message: "Roles fetched successfully",
      roles,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
