import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ProjectModel from "../models/Project/Project.model";
import { roleAndResourceRegex } from "../utils/constants";
import TenantModel from "../models/Tenant/Tenant.model";
import { v4 as uuidv4 } from "uuid";
import { decodeQuery } from "../utils/queryParser";
import { advanceFilter } from "../utils/filters";
import LogModel from "../models/Log/Log.model";
import mongoose from "mongoose";

export const checkValidProject = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;
    const { projectKey } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Unauthorized! User not found." });
    }

    const project = await ProjectModel.findOne({
      projectKey,
      "projectMembers.email": user.email,
    });

    if (!project) {
      return res.status(400).json({ message: "Invalid project key!" });
    }

    return res.status(200).json({ message: "Valid project key!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    const { projectName, projectKey } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: "Project name is required" });
    }

    if (!roleAndResourceRegex.test(projectKey)) {
      return res.status(400).json({ message: "Invalid project key!" });
    }

    const keyAlreadyExists = await ProjectModel.findOne({ projectKey });

    if (keyAlreadyExists) {
      return res.status(400).json({
        message:
          "Project key already exists. Please choose a different key for your project.",
      });
    }

    const newProject = new ProjectModel({
      projectName,
      projectKey,
      projectMembers: [
        {
          email: user.email,
          role: "owner",
        },
      ],
      tenants: [],
    });

    const globalTenant = new TenantModel({
      projectId: newProject._id,
      tenantName: "Global",
      tenantKey: "global",
      type: "global",
      users: [],
    });

    newProject.tenants.push({
      tenantId: globalTenant._id,
      type: globalTenant.type,
    });

    await globalTenant.save();
    await newProject.save();

    return res.status(201).json({
      message: "Project created successfully",
      projectKey: newProject.projectKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProjectLogs = async (req: Request, res: Response) => {
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

    let {
      q = "",
      starting_after = false,
      ending_before = false,
    }: any = req.query;
    q = decodeQuery(q.toString());

    const { filters, searchTerm } = advanceFilter({
      q,
      toFind: ["user", "tenant", "resource", "action"],
    });

    const query: any = {
      projectId: project._id,
    };

    const sort: any = {
      _id: -1,
    };

    if (filters?.tenant?.length > 0) {
      query.tenantKey = { $in: filters.tenant };
    }

    if (filters?.resource?.length > 0) {
      query.resourceKey = { $in: filters.resource };
    }

    if (filters?.user?.length > 0) {
      query.userKey = { $in: filters.user };
    }

    if (filters?.action?.length > 0) {
      query.action = { $in: filters.action };
    }

    if (searchTerm) {
      query.$or = [
        { userKey: { $regex: searchTerm, $options: "i" } },
        { tenantKey: { $regex: searchTerm, $options: "i" } },
        { resourceKey: { $regex: searchTerm, $options: "i" } },
        { action: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const lastDoc = await LogModel.findOne(query, {
      _id: 1,
    }).sort({ _id: 1 });

    const firstDoc = await LogModel.findOne(query, {
      _id: 1,
    }).sort({ _id: -1 });

    if (starting_after && lastDoc?._id.toString() !== starting_after) {
      const log = await LogModel.findOne({
        _id: starting_after,
        projectId: project._id,
      });

      if (!log) {
        return res.status(400).json({
          message: `Activity log not Found for starting_after '${starting_after}'`,
        });
      }

      query._id = {
        $lt: log._id,
      };

      sort._id = -1;
    }

    if (ending_before && firstDoc?._id.toString() !== ending_before) {
      const log = await LogModel.findOne({
        _id: ending_before,
        projectId: project._id,
      });

      if (!log) {
        return res.status(400).json({
          message: `Activity log not Found for ending_before '${ending_before}'`,
        });
      }

      query._id = {
        $gt: log._id,
      };

      sort._id = 1;
    }

    interface ReturnType {
      _id: mongoose.Types.ObjectId;
      key: mongoose.Types.ObjectId;
      userKey: string;
      tenantKey: string;
      resourceKey: string;
      action: string;
      timestamp: number;
      decision: string;
      reason: string;
      metadata: any;
    }

    const logs = await LogModel.find(query, {
      _id: 1,
      userKey: 1,
      tenantKey: 1,
      resourceKey: 1,
      action: 1,
      timestamp: 1,
      decision: 1,
      reason: 1,
      metadata: 1,
    })
      .sort(sort)
      .limit(100);

    const firstpage =
      logs[0]._id.toString() === firstDoc?._id.toString() ? true : false;
    const lastpage =
      logs[logs.length - 1]._id.toString() === lastDoc?._id.toString()
        ? true
        : false;

    const returnLogs: ReturnType[] = [];

    for (const log of logs) {
      const returnLog: ReturnType = {
        _id: log._id,
        key: log._id,
        userKey: log.userKey,
        tenantKey: log.tenantKey,
        resourceKey: log.resourceKey,
        action: log.action,
        timestamp: log.timestamp,
        decision: log.decision,
        reason: log.reason,
        metadata: log.metadata,
      };

      returnLogs.push(returnLog);
    }

    return res.status(200).json({
      message: "Logs fetched successfully",
      logs: returnLogs,
      first: firstpage ? true : false,
      last: lastpage ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createApiKey = async (req: Request, res: Response) => {
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

    const { identifier } = req.body;

    let validToken = false;
    let token;

    while (!validToken) {
      token = uuidv4();

      const keyAlreadyExists = await ProjectModel.findOne({
        "apiKeys.key": token,
      });

      if (!keyAlreadyExists) {
        validToken = true;
      }
    }

    if (!token) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    project.apiKeys.push({
      key: token,
      createdAt: new Date(),
      identifier,
    });

    await project.save();

    return res.status(201).json({
      message: "API Key created successfully",
      apiKey: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteApiKey = async (req: Request, res: Response) => {
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

    const { apiKeyId } = req.body;

    if (!apiKeyId) {
      return res.status(400).json({ message: "Invalid payload!" });
    }

    const apiKeyIndex = project.apiKeys.findIndex(
      (apiKey) => apiKey._id?.toString() == apiKeyId
    );

    if (apiKeyIndex < 0) {
      return res.status(400).json({ message: "Invalid API Key!" });
    }

    project.apiKeys.splice(apiKeyIndex, 1);

    await project.save();

    return res.status(201).json({
      message: "API Key deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllApiKeys = async (req: Request, res: Response) => {
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

    const apiKeys = project.apiKeys;

    return res.status(201).json({
      message: "API Keys fetched successfully",
      apiKeys,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProjectDetails = async (req: Request, res: Response) => {
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

    const { projectName, newProjectKey } = req.body;

    if (!projectName && !newProjectKey) {
      return res.status(400).json({ message: "Invalid payload!" });
    }

    if (!roleAndResourceRegex.test(newProjectKey)) {
      return res.status(400).json({ message: "Invalid project key!" });
    }

    const projectAlreadyExists = await ProjectModel.findOne({
      _id: { $ne: project._id },
      projectKey: newProjectKey,
      "projectMembers.email": user.email,
      "projectMembers.role": "owner",
    });

    if (projectAlreadyExists) {
      return res.status(400).json({
        message:
          "Project key already exists. Please choose a different key for your project.",
      });
    }

    project.projectName = projectName;
    project.projectKey = newProjectKey;

    await project.save();

    return res.status(201).json({
      message: "Project details updated successfully",
      projectKey: project.projectKey,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
