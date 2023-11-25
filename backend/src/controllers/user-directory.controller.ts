import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ProjectModel from "../models/Project/Project.model";
import { roleAndResourceRegex } from "../utils/constants";
import RoleModel, { RoleDoc } from "../models/Role/Role.model";
import UserDirectoryModel from "../models/UserDirectory/UserDirectory.model";
import { decodeQuery } from "../utils/queryParser";
import { advanceFilter } from "../utils/filters";
import TenantModel, { TenantDoc } from "../models/Tenant/Tenant.model";
import mongoose from "mongoose";
import { getGlobalTenant } from "../utils/services/constants";

export const createNewUser = async (req: Request, res: Response) => {
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

    const { userName, email, userKey, tenantId, assignRole } = req.body;

    if (!userName || !email || !userKey || !tenantId) {
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

    const userKeyRegex = roleAndResourceRegex;

    if (!userKeyRegex.test(userKey)) {
      return res.status(400).json({
        message:
          "User key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyAlreadyExists = await UserDirectoryModel.findOne({
      projectId: project._id,
      userKey,
      tenantId: { $in: [validTenant._id, globalTenant._id] },
    });

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: "User key already exists for this tenant/global tenant",
      });
    }

    const newUser = new UserDirectoryModel({
      projectId: project._id,
      userName,
      email,
      userKey,
      tenantId,
    });

    if (assignRole) {
      const roleExists = await RoleModel.findOne({
        projectId: project._id,
        tenantId: { $in: [validTenant._id, globalTenant._id] },
        _id: assignRole,
      });

      if (!roleExists) {
        return res.status(400).json({ message: "Invalid role" });
      }

      newUser.roleAssigned = roleExists._id;
    }

    await newUser.save();

    return res.json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editUser = async (req: Request, res: Response) => {
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

    const { userName, email, userKey, assignRole, userDirectoryId } =
      req.body;

    if (!userName || !email || !userKey || !userDirectoryId) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const UserDirectory = await UserDirectoryModel.findOne({
      projectId: project._id,
      _id: userDirectoryId,
    });

    if (!UserDirectory) {
      return res.status(400).json({ message: "User not found" });
    }

    const userKeyRegex = roleAndResourceRegex;

    if (!userKeyRegex.test(userKey)) {
      return res.status(400).json({
        message:
          "Role key must only consist of lowercase letters, numeric digits, hyphens, or underscores.",
      });
    }

    const globalTenant = await getGlobalTenant(project._id);

    const keyAlreadyExists = await UserDirectoryModel.findOne({
      projectId: project._id,
      userKey,
      _id: { $ne: userDirectoryId },
      tenantId: { $in: [UserDirectory.tenantId, globalTenant._id] },
    });

    if (keyAlreadyExists) {
      return res.status(400).json({
        message: "User key already exists for this tenant/global tenant",
      });
    }

    UserDirectory.userName = userName;
    UserDirectory.email = email;
    UserDirectory.userKey = userKey;
    UserDirectory.roleAssigned = undefined;

    if (assignRole) {
      const roleExists = await RoleModel.findOne({
        projectId: project._id,
        tenantId: { $in: [UserDirectory.tenantId, globalTenant._id] },
        _id: assignRole,
      });

      if (!roleExists) {
        return res.status(400).json({ message: "Invalid role" });
      }

      UserDirectory.roleAssigned = roleExists._id;
    }

    await UserDirectory.save();

    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
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

    const { userDirectoryId } = req.body;

    if (!userDirectoryId) {
      return res
        .status(400)
        .json({ message: "User Directory Id is required." });
    }

    const UserDirectory = await UserDirectoryModel.findOne({
      projectId: project._id,
      _id: userDirectoryId,
    });

    if (!UserDirectory) {
      return res.status(400).json({ message: "User not found" });
    }

    await UserDirectory.deleteOne();

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
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
      toFind: ["role", "tenant"],
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

    let roleIds = [];
    if (filters?.role?.length > 0) {
      roleIds = await RoleModel.find(
        {
          projectId: project._id,
          roleKey: { $in: filters.role },
        },
        {
          _id: 1,
        }
      );

      if (roleIds.length > 0) {
        roleIds = roleIds.map((role: RoleDoc) => role._id);
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

    if (filters?.role?.length > 0) {
      query.roleAssigned = { $in: roleIds };
    }

    if (searchTerm) {
      query.$or = [
        {
          userName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          userKey: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    const totalUsers = await UserDirectoryModel.countDocuments(query);

    const lastDoc = await UserDirectoryModel.findOne(query, {
      userKey: 1,
    }).sort({ _id: -1 });

    const firstDoc = await UserDirectoryModel.findOne(query, {
      userKey: 1,
    }).sort({ _id: 1 });

    if (starting_after && lastDoc?.userKey !== starting_after) {
      const userDirectory = await UserDirectoryModel.findOne({
        userKey: starting_after,
        projectId: project._id,
      });

      if (!userDirectory) {
        return res.status(400).json({
          message: `User not Found for starting_after '${starting_after}'`,
        });
      }

      query._id = {
        $gt: userDirectory._id,
      };

      sort._id = 1;
    }

    if (ending_before && firstDoc?.userKey !== ending_before) {
      const userDirectory = await UserDirectoryModel.findOne({
        userKey: ending_before,
        projectId: project._id,
      });

      if (!userDirectory) {
        return res.status(400).json({
          message: `User not Found for ending_before '${ending_before}'`,
        });
      }

      query._id = {
        $lt: userDirectory._id,
      };

      sort._id = -1;
    }

    interface ReturnType {
      _id: mongoose.Types.ObjectId;
      key: string;
      userName: string;
      userKey: string;
      email: string;
      tenantName: string;
      tenantKey: string;
      assignedRole?: string;
    }

    const users = await UserDirectoryModel.find(query, {
      _id: 1,
      userName: 1,
      userKey: 1,
      email: 1,
      tenantId: 1,
      roleAssigned: 1,
    })
      .limit(25)
      .sort(sort);

    const firstpage = users[0].userKey === firstDoc?.userKey ? true : false;
    const lastpage =
      users[users.length - 1].userKey === lastDoc?.userKey ? true : false;

    const returnUsers: ReturnType[] = [];

    for (const u of users) {
      const tenant = await TenantModel.findOne(
        {
          _id: u.tenantId,
        },
        {
          tenantName: 1,
          tenantKey: 1,
        }
      );

      if (!tenant) {
        return res.status(400).json({
          message: `Tenant not Found for user '${u.userKey}'`,
        });
      }

      const returnUser: ReturnType = {
        _id: u._id,
        key: u._id,
        userName: u.userName,
        userKey: u.userKey,
        email: u.email,
        tenantName: tenant.tenantName,
        tenantKey: tenant.tenantKey,
      };

      if (u.roleAssigned) {
        const role = await RoleModel.findOne(
          {
            _id: u.roleAssigned,
          },
          {
            roleKey: 1,
          }
        );

        if (!role) {
          return res.status(400).json({
            message: `Role not Found for user '${u.userKey}'`,
          });
        }

        returnUser.assignedRole = role.roleKey;
      }

      returnUsers.push(returnUser);
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      users: returnUsers,
      totalUsers,
      first: firstpage ? true : false,
      last: lastpage ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
