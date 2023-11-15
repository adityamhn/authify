import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";
import { createNewUser, deleteUser, editUser, getAllUsers } from "../controllers/user-directory.controller";

const router = express.Router();

router.post("/create", [verifySession, verifyProject], createNewUser);

router.post("/edit", [verifySession, verifyProject], editUser);

router.post("/all", [verifySession, verifyProject], getAllUsers);

router.post("/delete", [verifySession, verifyProject], deleteUser);






export { router as userDirectoryRoutes };
