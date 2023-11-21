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
    return res.status(401).json({ message: "Invalid Configuration! Api Token is not found." });
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

  const { tenant: tenantKey } = req.body;

  const tenant = await TenantModel.findOne({
    tenantKey,
    projectId: project._id,
  });

  if (!tenant) {
    return res.status(401).json({ message: "Invalid Tenant Key!" });
  }

  res.locals.projectId = project._id;
  res.locals.tenantId = tenant._id;
  next();
};
