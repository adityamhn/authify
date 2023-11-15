import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import UserModel from "../models/User/User.model";
import getSecrets from "../utils/getSecrets";
import { emailRegex } from "../utils/constants";
import ProjectModel from "../models/Project/Project.model";

export const requestLogin = async (req: Request, res: Response) => {
  try {
    let { email } = req.body;

    email = sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    });

    email = email.toLowerCase();

    const verifiedUserAlreadyExists = await UserModel.findOne({
      email: email,
      "onboarding.step": { $gt: 0 },
    });

    if (verifiedUserAlreadyExists) {
      return res.status(200).json({
        message: "User already exists!",
        code: "USER_ALREADY_EXISTS",
        redirect: "/auth/login?u=" + verifiedUserAlreadyExists._id,
      });
    }

    let user = await UserModel.findOne({ email: email });


    if (!user) {
      user = new UserModel({
        email: email,
        onboarding: {
          completed: false,
          step: 0,
        },
        createdAt: new Date(),
      });

      await user.save();
    }

    // create a session
    req.session.user = {
      userId: user._id.toString(),
    };

    const DEPLOYMENT = await getSecrets("DEPLOYMENT");

    req.session.environment = `authify-${DEPLOYMENT}`;

    req.session.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "ERROR_IN_SESSION" });
      }
    });

    return res.status(200).json({
      message: "User created successfully",
      code: "USER_CREATED_SUCCESSFULLY",
      redirect: "/onboarding",
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginRequestDetails = async (req: Request, res: Response) => {
  try {
    const { u } = req.query;

    if (!u) {
      return res.status(400).json({
        message: "Invalid request!",
        code: "INVALID_REQUEST",
      });
    }

    const user = await UserModel.findOne({ _id: u });

    if (!user) {
      return res.status(400).json({
        message: "Request Expired! Please login again.",
        code: "REQUEST_EXPIRED",
        redirect: "/auth",
      });
    }

    return res.status(200).json({
      message: "Request details fetched successfully",
      code: "REQUEST_DETAILS_FETCHED_SUCCESSFULLY",
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    email = sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    });

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address! Please try again.",
        code: "INVALID_EMAIL",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const passwordIsValid = await user.MatchPassword(password);

    if (!passwordIsValid) {
      return res.status(400).json({
        message: "Invalid Account Credentials!",
      });
    }

    // create a session
    req.session.user = {
      userId: user._id.toString(),
    };

    const DEPLOYMENT = await getSecrets("DEPLOYMENT");

    req.session.environment = `authify-${DEPLOYMENT}`;

    req.session.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "ERROR_IN_SESSION" });
      }
    });

    const defaultProject = await ProjectModel.findOne({
      "projectMembers.email": user.email,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      code: "USER_LOGGED_IN_SUCCESSFULLY",
      user: {
        id: user._id,
        email: user.email,
      },
      projectKey: defaultProject ? defaultProject.projectKey : null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkLoginStatus = async (req: Request, res: Response) => {
  try {
    const { user } = req.session;


    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await UserModel.findById(user.userId);

    if (!userFound) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const defaultProject = await ProjectModel.findOne({
      "projectMembers.email": userFound.email,
    });

    return res.status(200).json({
      isLoggedIn: true,
      user: {
        id: userFound._id,
        email: userFound.email,
      },
      projectKey: defaultProject ? defaultProject.projectKey : null,
      onboarding: userFound.onboarding,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", isLoggedIn: false });
  }
};

// logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = req.session.user;
    if (user != null) {
      const SESS_NAME = await getSecrets("SESS_NAME");

      req.session.destroy(() => {
        return res.clearCookie(SESS_NAME).json(user);
      });
    } else {
      return res.status(400).json({ message: "ERROR_SESSION_NOT_FOUND" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "ERROR" });
  }
};

