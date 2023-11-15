import express from "express";
import {  checkLoginStatus, loginRequestDetails, logoutUser, requestLogin, userLogin } from "../controllers/auth.controller";

const router = express.Router();


router.post("/", requestLogin);

router.get("/login", loginRequestDetails);

router.post("/login", userLogin);

router.get("/status", checkLoginStatus);

router.get("/logout", logoutUser);









export { router as authRoutes };