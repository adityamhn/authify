import { Request, Response } from "express";
import UserModel from "../models/User/User.model";
import ProjectModel from "../models/Project/Project.model";
import TenantModel from "../models/Tenant/Tenant.model";
import RoleModel from "../models/Role/Role.model";
import ResourceModel from "../models/Resource/Resource.model";

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    if (!userId) {
      return res.status(403).json({ message: "User not found!" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const data = {
      name: user.name,
      email: user.email,
    };

    const projects = await ProjectModel.find(
      {
        "projectMembers.email": user.email,
      },
      {
        projectKey: 1,
        projectName: 1,
      }
    );

    return res.status(200).json({
      message: "User found!",
      data,
      projects: projects.length > 0 ? projects : null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserPolicy = async (req: Request, res: Response) => {
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

    let tenant;

    if (!tenantKey) {
      tenant = await TenantModel.findOne({
        type: "global",
        projectId: projectId,
      });
    } else {
      tenant = await TenantModel.findOne({
        tenantKey: tenantKey,
        projectId: projectId,
      });
    }

    if (!tenant) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Tenant not found." });
    }

    const roles =
      (await RoleModel.find(
        {
          tenantId: tenant._id,
          projectId: projectId,
        },
        {
          roleName: 1,
          roleKey: 1,
          resourcesAttached: 1,
        }
      )) ?? [];

    const resources =
      (await ResourceModel.find(
        {
          tenantId: tenant._id,
          projectId: projectId,
        },
        {
          resourceKey: 1,
          actions: 1,
        }
      )) ?? [];

    const columns = roles.map((role) => ({
      roleName: role.roleName,
      roleKey: role.roleKey,
    }));

    const rows = [];

    for (const resource of resources) {
      const row: any = {
        resourceKey: resource.resourceKey,
        type: "resource",
        expanded: true,
        key: resource.resourceKey,
      };

      const actions: any = resource.actions.map((action) => ({
        resourceKey: action,
        type: "action",
        key: `${resource.resourceKey}:${action}`,
      }));

      const roleAssigned = roles.filter((role) => {
        const resourceAssigned = role.resourcesAttached.find(
          (resourceAttached) =>
            resourceAttached.resourceId.toString() === resource._id.toString()
        );

        return resourceAssigned !== undefined;
      });

      for (const role of roleAssigned) {
        row[role.roleKey] = false;

        const resourceAssigned = role.resourcesAttached.find(
          (resourceAttached) =>
            resourceAttached.resourceId.toString() === resource._id.toString()
        );

        if (resourceAssigned) {
          if (
            resourceAssigned.actions.length === resource.actions.length &&
            resourceAssigned.actions.every((action) =>
              resource.actions.includes(action)
            )
          ) {
            row[role.roleKey] = true;
          } else if (
            resourceAssigned.actions.some((action) =>
              resource.actions.includes(action)
            )
          ) {
            row[role.roleKey] = "intermediate";
          }
        }

        for (const action of actions) {
          action[role.roleKey] = false;

          if (resourceAssigned) {
            if (resourceAssigned.actions.includes(action.resourceKey)) {
              action[role.roleKey] = true;
            }
          }
        }
      }

      actions[actions.length - 1].isLastAction = true;

      rows.push(row);

      rows.push(...actions);
    }

    return res.status(200).json({
      message: "User Policy found!",
      policy: {
        columns,
        rows,
        tenantKey: tenant.tenantKey,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePolicy = async (req: Request, res: Response) => {
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

    const { tenantKey, policy } = req.body;

    const tenant = await TenantModel.findOne({
      tenantKey: tenantKey,
      projectId: projectId,
    });

    if (!tenant) {
      return res
        .status(401)
        .json({ message: "Unauthorized! Tenant not found." });
    }

    for (const action of policy) {
      if (action.type === "action") {
        const [resourceKey, actionKey] = action.key.split(":");

        const resource = await ResourceModel.findOne({
          resourceKey: resourceKey,
          projectId: projectId,
          tenantId: tenant._id,
        });

        if (!resource) {
          return res
            .status(401)
            .json({ message: "Unauthorized! Resource not found." });
        }

        if (!resource.actions.includes(actionKey)) {
          return res
            .status(401)
            .json({ message: "Unauthorized! Action not found." });
        }

        // resourceKey: resource.resourceKey,
        // type: "resource",
        // expanded: true,
        // key: resource.resourceKey,

        // await new Promise(async (resolve: any, reject) => {
        //   try {
        //     Object.keys(action).forEach(async (key) => {
        for (const key of Object.keys(action)) {
          if (
            key !== "key" &&
            key !== "type" &&
            key !== "isLastAction" &&
            key !== "expanded" &&
            key !== "resourceKey"
          ) {
            const roleKey = key;

            const role = await RoleModel.findOne({
              roleKey: roleKey,
              projectId: projectId,
              tenantId: tenant._id,
            });

            if (!role) {
              return res
                .status(401)
                .json({ message: "Unauthorized! Role not found." });
            }

            const resourceAssigned = role.resourcesAttached.find(
              (resourceAttached) =>
                resourceAttached.resourceId.toString() ===
                resource._id.toString()
            );

            if (resourceAssigned) {
              if (resourceAssigned.actions.includes(actionKey)) {
                if (!action[key]) {
                  resourceAssigned.actions = resourceAssigned.actions.filter(
                    (action) => action !== actionKey
                  );

                  if (resourceAssigned.actions.length === 0) {
                    role.resourcesAttached = role.resourcesAttached.filter(
                      (resourceAttached) =>
                        resourceAttached.resourceId.toString() !==
                        resource._id.toString()
                    );
                  }
                }
              } else {
                if (action[key]) {
                  resourceAssigned.actions.push(actionKey);
                }
              }
            } else {
              if (action[key]) {
                role.resourcesAttached.push({
                  resourceId: resource._id,
                  actions: [actionKey],
                });
              }
            }

            await role.save();
          }
        }
      }
    }

    return res.status(200).json({
      message: "User Policy Updated!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
