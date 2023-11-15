import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { checkValidProject, createProject } from "../controllers/project.controller";


const router = express.Router();


router.post("/check", [verifySession], checkValidProject);

router.post("/create", [verifySession], createProject);




export { router as projectRoutes };
