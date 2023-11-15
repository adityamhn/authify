import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { addAction, createNewResource, deleteAction, deleteResource, editResource, getAllResources, getResourcesListTenant } from "../controllers/resource.controller";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";

const router = express.Router();

router.post("/create", [verifySession, verifyProject], createNewResource);

router.post("/edit", [verifySession, verifyProject], editResource);

router.post("/all", [verifySession, verifyProject], getAllResources);

router.post("/delete", [verifySession, verifyProject], deleteResource);

router.post("/delete-action", [verifySession, verifyProject], deleteAction);

router.post("/add-action", [verifySession, verifyProject], addAction);

router.post("/list", [verifySession, verifyProject], getResourcesListTenant);






export { router as resourceRoutes };
