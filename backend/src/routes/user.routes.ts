import express from "express";
import { getUserDetails, getUserPolicy, updatePolicy } from "../controllers/user.controller";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";

const router = express.Router();

router.get("/", [verifySession], getUserDetails);

router.post("/policy", [verifySession, verifyProject], getUserPolicy);

router.post("/update-policy", [verifySession, verifyProject], updatePolicy);



export { router as userRoutes };
