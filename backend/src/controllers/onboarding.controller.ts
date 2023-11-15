import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import bcrypt from "bcryptjs";
import { roleAndResourceRegex } from "../utils/constants";
import ProjectModel from "../models/Project/Project.model";
import TenantModel from "../models/Tenant/Tenant.model";

export const getUserOnboarding = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    if (!userId) {
      return res.status(403).json({ message: "User not found!" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const { onboarding } = user;

    if (onboarding.completed) {
      const defaultProject = await ProjectModel.findOne({
        "projectMembers.email": user.email,
      });

      if (!defaultProject) {
        return res.status(400).json({ message: "Default project not found!" });
      }

      return res.status(200).json({
        message: "Onboarding completed!",
        completed: true,
        step: onboarding.step,
        projectKey: defaultProject.projectKey,
      });
    }

    return res.status(200).json({
      message: "Onboarding not completed!",
      completed: false,
      step: onboarding.step,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserOnboarding = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;
    const { step, data } = req.body;

    if (!userId) {
      return res.status(403).json({ message: "UserId not found!" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const { onboarding } = user;

    if (onboarding.completed) {
      const defaultProject = await ProjectModel.findOne({
        "projectMembers.email": user.email,
      });

      if (!defaultProject) {
        return res.status(400).json({ message: "Default project not found!" });
      }

      return res.status(200).json({
        message: "Onboarding completed!",
        completed: true,
        step: onboarding.step,
        projectKey: defaultProject.projectKey,
      });
    }

    if (onboarding.step !== step) {
      if (onboarding.step > step) {
        return res.status(400).json({
          message: "Invalid step! This step is already completed.",
        });
      } else {
        return res.status(400).json({
          message: "Invalid step! Complete the previous steps to contiue.",
        });
      }
    }

    if (step === 0) {
      const { name, password } = data;

      if (!name || !password) {
        return res.status(400).json({ message: "Invalid request body!" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      user.name = name;
      user.password = hashedPassword;

      onboarding.step = 1;

      await user.save();

      return res.status(200).json({
        message: "Onboarding step updated!",
        completed: onboarding.completed,
        step: onboarding.step,
      });
    } else if (step === 1) {
      const { projectName, projectKey } = data;

      if (!projectName || !projectKey) {
        return res.status(400).json({ message: "Invalid request body!" });
      }

      if (!roleAndResourceRegex.test(projectKey)) {
        return res.status(400).json({ message: "Invalid project key!" });
      }

      const project = new ProjectModel({
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
        projectId: project._id,
        tenantName: "Global",
        tenantKey: "global",
        type: "global",
        users: [],
      });
      
      project.tenants.push({
        tenantId: globalTenant._id,
        type: globalTenant.type,
      });
      
      
      await globalTenant.save();
      await project.save();

      onboarding.step = 2;

      await user.save();

      return res.status(200).json({
        message: "Onboarding step updated!",
        completed: onboarding.completed,
        step: onboarding.step,
        projectKey: project.projectKey,
      });
    } else if (step === 2) {
      const { useType } = data;

      if (!useType) {
        return res.status(400).json({ message: "Invalid request body!" });
      }

      if (useType !== "personal" && useType !== "professional") {
        return res.status(400).json({ message: "Invalid use type!" });
      }

      user.useType = useType;

      onboarding.step = 3;
      onboarding.completed = true;

      await user.save();

      return res.status(200).json({
        message: "Onboarding step updated!",
        completed: onboarding.completed,
        step: onboarding.step,
      });
    } else if (step === 3) {
      onboarding.completed = true;

      const defaultProject = await ProjectModel.findOne({
        "projectMembers.email": user.email,
      });

      if (!defaultProject) {
        return res.status(400).json({ message: "Default project not found!" });
      }

      await user.save();

      return res.status(200).json({
        message: "Onboarding completed!",
        completed: true,
        step: onboarding.step,
        projectKey: defaultProject.projectKey,
      });
    }

    return res.status(400).json({ message: "Invalid step!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
