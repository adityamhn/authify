// Express
import express from "express";

// CORS
import cors from "cors";

// Cookie Parser and Session
import cookieParser from "cookie-parser";
import session from "express-session";

import { createClient } from "redis";
import RedisStore from "connect-redis";

import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";

import getSecrets from "./utils/getSecrets";
import { authRoutes } from "./routes/auth.routes";
import { onboardingRoutes } from "./routes/onboarding.routes";
import { projectRoutes } from "./routes/project.routes";
import { userRoutes } from "./routes/user.routes";
import { resourceRoutes } from "./routes/resource.routes";
import { tenantRoutes } from "./routes/tenant.routes";
import { roleRoutes } from "./routes/role.routes";
import { userDirectoryRoutes } from "./routes/user-directory.routes";
import { sdkRoutes } from "./routes/sdk.routes";

declare module "express-session" {
  export interface SessionData {
    user: { userId: string };
    environment: string;
  }
}

const initializeApp = async () => {
  const DEPLOYMENT = await getSecrets("DEPLOYMENT");
  const MONGO_URI = await getSecrets("MONGO_URI");

  const redisClient = createClient();

  const SESS_NAME = await getSecrets("SESS_NAME");
  const SESS_SECRET = await getSecrets("SESS_SECRET");

  const connectToDB = async () => {
    try {
      if (!MONGO_URI) {
        console.log("URI not provided!");
        return;
      }
      await mongoose.connect(MONGO_URI);
    } catch (err) {
      console.log(err);
    }
  };

  const app = express();
  const port = (await getSecrets("PORT")) ?? (8080 as number);

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    express.json({
      limit: "5mb",
      type: ["application/json", "text/plain"],
    })(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid JSON" });
      } else {
        next();
      }
    });
  });

  app.use(cookieParser());

  app.use(mongoSanitize());

  // SDK routes
  app.use("/api/sdk", sdkRoutes);

  const localWhitelist = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ];

  const testingWhitelist: any[] = [];

  const productionWhitelist: any[] = [];

  const corsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Headers",
      "x-csrf-token",
      "Set-Cookie",
    ],
    origin:
      DEPLOYMENT === "LOCAL"
        ? localWhitelist
        : DEPLOYMENT === "TESTING"
        ? testingWhitelist
        : productionWhitelist,
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  };

  app.use(cors(corsOptions));

  // @ts-ignore
  let redisStore = new RedisStore({ client: redisClient });

  const sessionConfig = {
    secret: SESS_SECRET as string,
    resave: false,
    name: SESS_NAME as string,
    saveUninitialized: false,
    proxy: true,
    store: redisStore,
    cookie: {
      sameSite: true,
      secure: DEPLOYMENT === "LOCAL" ? false : true,
      maxAge: 1000 * 60 * 60 * 12,
    },
  };

  app.use(session(sessionConfig));

  app.get("/", (req, res) => {
    res.send("Authify Api!");
  });

  // Auth routes
  app.use("/api/auth", authRoutes);

  // Onboarding routes
  app.use("/api/onboarding", onboardingRoutes);

  // User routes
  app.use("/api/user", userRoutes);

  // Project routes
  app.use("/api/project", projectRoutes);

  // Resource routes
  app.use("/api/resource", resourceRoutes);

  // Role routes
  app.use("/api/role", roleRoutes);

  // User Directory routes
  app.use("/api/user-directory", userDirectoryRoutes);

  // Tenant routes
  app.use("/api/tenant", tenantRoutes);

  app.listen(port, async () => {
    try {
      await connectToDB();
      console.log(`MongoDB connected`);
    } catch (err) {
      console.log(err);
    }

    try {
      await redisClient.connect();
      console.log(`Redis connected`);
    } catch (err) {
      console.log(err);
    }
    console.log(`Express is listening at http://localhost:${port}`);
  });
};

initializeApp().catch((error) => {
  console.error("Failed to initialize server:", error);
  process.exit(1);
});
