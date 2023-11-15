import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";
import { createNewTenant, deleteTenant, editTenant, getAllTenants, getTenantsList } from "../controllers/tenant.controller";

const router = express.Router();

router.post("/list", [verifySession, verifyProject], getTenantsList);

router.post("/create", [verifySession, verifyProject], createNewTenant);

router.post("/edit", [verifySession, verifyProject], editTenant);

router.post("/all", [verifySession, verifyProject], getAllTenants);

router.post("/delete", [verifySession, verifyProject], deleteTenant);



export { router as tenantRoutes };
