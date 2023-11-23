import express from "express";
import { checkPermission } from "../controllers/sdk.controller";
import { verifyApiToken } from "../middlewares/sdk/VerifyApiToken.middleware";
import { createLogRecordMiddleware } from "../middlewares/sdk/RecordLogs.middleware";

const router = express.Router();

router.post(
  "/check",
  [verifyApiToken, createLogRecordMiddleware],
  checkPermission
);

export { router as sdkRoutes };
