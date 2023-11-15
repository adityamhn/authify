import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ProjectModel from "../models/Project/Project.model";
import TenantModel from "../models/Tenant/Tenant.model";
import { roleAndResourceRegex } from "../utils/constants";
import { decodeQuery } from "../utils/queryParser";
import { advanceFilter } from "../utils/filters";
import mongoose from "mongoose";
import UserDirectoryModel from "../models/UserDirectory/UserDirectory.model";
import RoleModel from "../models/Role/Role.model";
import ResourceModel from "../models/Resource/Resource.model";

export const getTenantsList = async (req: Request, res: Response) => {
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

    const tenants = await TenantModel.find(
      { projectId: project._id },
      {
        tenantName: 1,
        tenantKey: 1,
        _id: 1,
        type: 1,
      }
    );

    return res.status(200).json({
      message: "Tenants fetched successfully",
      tenants,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// checked
export const createNewTenant = async (req: Request, res: Response) => {
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

    const { tenantName, tenantKey, description } = req.body;

    if (!tenantName || !tenantKey) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const tenantKeyRegex = roleAndResourceRegex;

    if (!tenantKeyRegex.test(tenantKey)) {
      return res.status(400).json({ message: "Tenant key is not valid" });
    }

    const tenantKeyExists = await TenantModel.findOne({
      projectId: project._id,
      tenantKey,
    });

    if (tenantKeyExists) {
      return res
        .status(400)
        .json({ message: "Tenant with this key already exists in your project" });
    }

    const newTenant = new TenantModel({
      projectId: project._id,
      tenantName,
      tenantKey,
      description,
      type: "custom",
    });

    project.tenants.push({
      tenantId: newTenant._id,
      type: "custom",
    });

    await project.save();
    await newTenant.save();

    return res.status(200).json({
      message: "Tenant created successfully",
      tenantKey: newTenant.tenantKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// checked
export const editTenant = async (req: Request, res: Response) => {
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

    const { tenantId, tenantName, description, tenantKey } = req.body;

    if (!tenantId || !tenantName || !tenantKey) {
      return res
        .status(400)
        .json({ message: "Required details are not provided." });
    }

    const tenantKeyRegex = roleAndResourceRegex;

    if (!tenantKeyRegex.test(tenantKey)) {
      return res.status(400).json({ message: "Tenant key is not valid" });
    }

    const tenantKeyExists = await TenantModel.findOne({
      _id: { $ne: tenantId },
      projectId: project._id,
      tenantKey,
    });

    if (tenantKeyExists) {
      return res
        .status(400)
        .json({ message: "Tenant with this key already exists" });
    }

    const tenant = await TenantModel.findOne({
      _id: tenantId,
      projectId: project._id,
    });

    if (!tenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    tenant.tenantName = tenantName;
    tenant.description = description;
    tenant.tenantKey = tenantKey;

    await tenant.save();

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenantKey: tenant.tenantKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// checked
export const getAllTenants = async (req: Request, res: Response) => {
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
      toFind: ["user"],
    });

    const users = filters.user ?? [];

    const query: any = {
      projectId: project._id,
    };

    const sort: any = {
      _id: 1,
    };

    if (filters?.user?.length > 0) {
      query["users.userKey"] = {
        $in: users,
      };
    }

    if (searchTerm) {
      query.$or = [
        {
          tenantName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          tenantKey: {
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

    const totalTenants = await TenantModel.countDocuments(query);

    const lastDoc = await TenantModel.findOne(query, {
      tenantKey: 1,
    }).sort({ _id: -1 });

    const firstDoc = await TenantModel.findOne(query, {
      tenantKey: 1,
    }).sort({ _id: 1 });

    if (starting_after && lastDoc?.tenantKey !== starting_after) {
      const tenant = await TenantModel.findOne({
        tenantKey: starting_after,
        projectId: project._id,
      });

      if (!tenant) {
        return res.status(400).json({
          message: `Tenant not Found for starting_after '${starting_after}'`,
        });
      }

      query._id = {
        $gt: tenant._id,
      };

      sort._id = 1;
    }

    if (ending_before && firstDoc?.tenantKey !== ending_before) {
      const tenant = await TenantModel.findOne({
        tenantKey: ending_before,
        projectId: project._id,
      });

      if (!tenant) {
        return res.status(400).json({
          message: `Tenant not Found for ending_before '${ending_before}'`,
        });
      }

      query._id = {
        $lt: tenant._id,
      };

      sort._id = -1;
    }

    interface ReturnType {
      _id: mongoose.Types.ObjectId;
      key: string;
      tenantName: string;
      tenantKey: string;
      description: string;
      type: "custom" | "global";
      totalUsers: Number;
    }

    const tenants = await TenantModel.find(query, {
      tenantName: 1,
      tenantKey: 1,
      description: 1,
    })
      .limit(25)
      .sort(sort);

    const firstpage =
      tenants[0].tenantKey === firstDoc?.tenantKey ? true : false;
    const lastpage =
      tenants[tenants.length - 1].tenantKey === lastDoc?.tenantKey
        ? true
        : false;

    const returnTenants: ReturnType[] = [];

    for (const tenant of tenants) {
      const totalUsers = await UserDirectoryModel.countDocuments({
        tenantId: tenant._id,
      });

      returnTenants.push({
        _id: tenant._id,
        key: tenant._id,
        tenantName: tenant.tenantName,
        tenantKey: tenant.tenantKey,
        description: tenant.description,
        totalUsers: totalUsers ?? 0,
        type: tenant.type,
      });
    }

    return res.status(200).json({
      message: "Tenants fetched successfully",
      tenants: returnTenants,
      first: firstpage ? true : false,
      last: lastpage ? true : false,
      totalTenants,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
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

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant id is not provided" });
    }

    const tenant = await TenantModel.findOne({
      _id: tenantId,
      projectId: project._id,
    });

    if (!tenant) {
      return res.status(400).json({ message: "Tenant not found" });
    }

    if (tenant.type === "global") {
      return res
        .status(400)
        .json({ message: "Global tenant cannot be deleted" });
    }

    await UserDirectoryModel.deleteMany({
      tenantId: tenant._id,
      projectId: project._id,
    });

    await RoleModel.deleteMany({
      tenantId: tenant._id,
      projectId: project._id,
    });

    await ResourceModel.deleteMany({
      tenantId: tenant._id,
      projectId: project._id,
    });

    project.tenants = project.tenants.filter(
      (tenant) => tenant.tenantId.toString() !== tenantId
    );

    await tenant.deleteOne();

    return res.status(200).json({
      message: "Tenant deleted successfully",
      tenantKey: tenant.tenantKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
