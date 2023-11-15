import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";
import { attachResource, createNewRole, deleteRole, editRole, getAllRoles, getAttachedResources, getRolesListTenant } from "../controllers/role.controller";

const router = express.Router();

router.post("/create", [verifySession, verifyProject], createNewRole);

router.post("/edit", [verifySession, verifyProject], editRole);

router.post("/all", [verifySession, verifyProject], getAllRoles);

router.post("/delete", [verifySession, verifyProject], deleteRole);

router.post("/attach-resource", [verifySession, verifyProject], attachResource);

router.post("/get-attached-resources", [verifySession, verifyProject], getAttachedResources);

router.post("/list", [verifySession, verifyProject], getRolesListTenant);




export { router as roleRoutes };
