import { Response, NextFunction, Request } from "express";
import ProjectModel from "../../models/Project/Project.model";
import TenantModel from "../../models/Tenant/Tenant.model";

export const verifyApiToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-authify-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Invalid Configuration! Api Token is not found." });
  }

  const project = await ProjectModel.findOne({
    apiKeys: {
      $elemMatch: {
        key: token,
      },
    },
  });

  if (!project) {
    return res.status(401).json({ message: "Invalid Api Token!" });
  }

  res.locals.projectId = project._id;
  next();
};
