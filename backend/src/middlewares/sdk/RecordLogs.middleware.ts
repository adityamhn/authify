import { Response, NextFunction, Request } from "express";
import { createInitialLogRecord } from "../../utils/services/logs";
import moment from "moment";

export const createLogRecordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = res.locals;

  const {
    tenant: tenantKey,
    user: userKey,
    resourceAction,
    metadata,
  } = req.body;

  const [resourceKey, actionKey] = resourceAction.split(":");

  const finalMetadata: any = {};

  if (metadata) {
    Object.keys(metadata).forEach((key) => {
      if (metadata[key]) {
        finalMetadata[key] = metadata[key] as string;
      }
    });
  }

  const log = await createInitialLogRecord({
    projectId,
    tenantKey,
    userKey,
    timestamp: Number(moment().unix()),
    resourceKey,
    action: actionKey,
    metadata: finalMetadata,
  });

  res.locals.logId = log._id;
  next();
};
