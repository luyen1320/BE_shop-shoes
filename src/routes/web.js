import express from "express";
import userController from "../controller/userController";
import sizeController from "../controller/sizeController";
import supplierController from "../controller/supplierController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.post("/create-new-user", userController.handleRegister);
  router.post("/login", userController.handleLogin);

  router.get("/size", sizeController.readSize);

  //supplier
  router.post("/supplier/create", supplierController.createSupplier);
  router.get("/supplier/read", supplierController.getSuppliers);
  router.delete("/supplier/delete", supplierController.deleteSupp);
  router.put("/supplier/update", supplierController.updateSupp);

  return app.use("/api/v1/", router);
};

export default initWebRoutes;
