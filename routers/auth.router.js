import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import AuthController from "../controllers/auth/index.js";

const router = new Router();

router.post(
  "/signin",
  body(["id", "password"]).notEmpty().isString("type has not string").trim(),
  AuthController.signin,
);

router.post(
  "/signup",
  body(["id", "password"]).notEmpty().isString().trim(),
  AuthController.signup,
);

router.post("/signin/new_token", authMiddleware, AuthController.newToken);

router.get("/info", authMiddleware, AuthController.info);

router.get("/logout", authMiddleware, AuthController.logout);

export default router;
