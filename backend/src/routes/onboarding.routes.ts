import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { getUserOnboarding, updateUserOnboarding } from "../controllers/onboarding.controller";

const router = express.Router();

router.get("/", [verifySession], getUserOnboarding);

router.post("/", [verifySession], updateUserOnboarding);


export { router as onboardingRoutes };
