import LogModel from "../../models/Log/Log.model";

export const createInitialLogRecord = async ({
  projectId,
  tenantKey,
  userKey,
  timestamp,
  resourceKey,
  action,
  metadata,
}: any) => {
  const log = new LogModel({
    projectId,
    tenantKey,
    userKey,
    timestamp,
    resourceKey,
    action,
    metadata,
    decision: "denied",
  });

  try {
    const savedLog = await log.save();
    return savedLog;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateDenyReason = async (logId: string, reason: string) => {
  try {
    const log = await LogModel.findById(logId);

    if (!log) {
      throw new Error("Log not found!");
    }

    log.decision = "denied";
    log.reason = reason;

    const savedLog = await log.save();
    return savedLog;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const allowAccessToUser = async (logId: string) => {
  try {
    const log = await LogModel.findById(logId);

    if (!log) {
      throw new Error("Log not found!");
    }

    log.decision = "allowed";

    const savedLog = await log.save();
    return savedLog;
  } catch (err: any) {
    throw new Error(err);
  }
};
