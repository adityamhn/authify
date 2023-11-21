import express from "express";
import { checkPermission } from "../controllers/sdk.controller";
import { verifyApiToken } from "../middlewares/sdk/VerifyApiToken.middleware";

const router = express.Router();

router.post("/check", [verifyApiToken], checkPermission);

export { router as sdkRoutes };
