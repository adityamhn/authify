import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ProjectModel from "../models/Project/Project.model";
import { roleAndResourceRegex } from "../utils/constants";
import TenantModel from "../models/Tenant/Tenant.model";

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
      return res
        .status(400)
        .json({
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

// Edit Project Details

// Add User to Project

// Remove User from Project

// Change User Role in Project

// Transfer Project Ownership
