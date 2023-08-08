import express from "express";
import userController from "../controller/userController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.post("/create-new-user", userController.handleRegister);
  router.post("/login", userController.handleLogin);

  return app.use("/api/v1/", router);
};

export default initWebRoutes;
