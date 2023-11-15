import { Response, NextFunction, Request } from "express";
import UserModel from "../../models/User/User.model";
import ProjectModel from "../../models/Project/Project.model";

export const verifyProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const { projectKey } = req.body;

  const user = await UserModel.findOne({
    _id: userId?.toString(),
  });

  if (!user) {
    return res.status(403).send({ message: "USER_NOT_FOUND" });
  }

  if (!projectKey) {
    return res.status(401).json({ message: "Project key Not Found!" });
  }

  const project = await ProjectModel.findOne({
    projectKey,
    "projectMembers.email": user.email,
  });

  if (!project) {
    return res
      .status(401)
      .json({ message: "Unauthorized! Project not found." });
  }

  res.locals.projectId = project._id;

  next();
};
