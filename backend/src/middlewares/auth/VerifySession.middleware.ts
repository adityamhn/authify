import { Response, NextFunction, Request } from "express";
import getSecrets from "../../utils/getSecrets";
import UserModel from "../../models/User/User.model";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    return res.status(403).send({ message: "SESSION_NOT_PROVIDED" });
  }
  const session = req.session; // cookie

  const FRONTEND_URL = await getSecrets("FRONTEND_URL");

  if (session.user == null) {
    res.redirect(`${FRONTEND_URL}/auth`);
    return;
  }

  const userId = session.user.userId;

  const user = await UserModel.findOne({
    _id: userId?.toString(),
  });

  if (!user) {
    return res.status(403).send({ message: "USER_NOT_FOUND" });
  }

  res.locals.userId = userId;

  next();
};
