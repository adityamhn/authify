import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { checkValidProject, createApiKey, createProject, getAllApiKeys, getProjectLogs } from "../controllers/project.controller";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";


const router = express.Router();


router.post("/check", [verifySession], checkValidProject);

router.post("/create", [verifySession], createProject);

router.post("/logs",[verifySession, verifyProject], getProjectLogs)

router.post("/api-key/create", [verifySession, verifyProject], createApiKey);

router.post("/api-key/all", [verifySession, verifyProject], getAllApiKeys);





export { router as projectRoutes };
