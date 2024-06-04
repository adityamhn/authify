import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { addAction, createNewResource, deleteAction, deleteResource, editResource, getAllResources, getResourcesListTenant, uploadResources } from "../controllers/resource.controller";
import { verifyProject } from "../middlewares/auth/VerifyProject.middleware";
import { uploadJsonCsvMiddleware } from "../middlewares/files/multer.middleware";

const router = express.Router();

router.post("/create", [verifySession, verifyProject], createNewResource);

router.post("/edit", [verifySession, verifyProject], editResource);

router.post("/all", [verifySession, verifyProject], getAllResources);

router.post("/upload", [verifySession, verifyProject, uploadJsonCsvMiddleware.single("upload")], uploadResources);

router.post("/delete", [verifySession, verifyProject], deleteResource);

router.post("/delete-action", [verifySession, verifyProject], deleteAction);

router.post("/add-action", [verifySession, verifyProject], addAction);

router.post("/list", [verifySession, verifyProject], getResourcesListTenant);






export { router as resourceRoutes };
