import express from "express";
import userController from "../controller/userController";
import sizeController from "../controller/sizeController";
import supplierController from "../controller/supplierController";
import productController from "../controller/productController";
import reviewController from "../controller/reviewController";
import orderController from "../controller/orderController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.post("/create-new-user", userController.handleRegister);
  router.get("/getstaff", userController.getAllStaff);
  router.get("/getuser", userController.getAllUser);
  router.get("/getuser/:id", userController.getOneStaff);
  router.delete("/user/:id", userController.deleteUser);
  router.put("/user/update", userController.updateUser);
  router.post("/login", userController.handleLogin);

  router.get("/size", sizeController.readSize);

  //Order
  router.post("/addtocart", orderController.addToCart);
  router.delete("/removeproductcart", orderController.deleteProductInCart);
  router.get("/getproductincart/:id", orderController.getProductInCart);
  router.post("/createOrder", orderController.createOrder);
  router.get("/getallorder", orderController.getAllOrder);
  router.get("/getorder/:id", orderController.getAllOrderByUserId);
  router.put("/updateorder/:id", orderController.updateOrder);

  //product
  router.post("/product/create", productController.createProduct);
  router.put("/product/update", productController.updateProduct);
  router.get("/product/:id", productController.getOneProduct);
  router.delete("/product/:id", productController.deleteProduct);
  router.get("/product", productController.getAllProduct);

  //supplier
  router.post("/supplier/create", supplierController.createSupplier);
  router.get("/supplier/read", supplierController.getSuppliers);
  router.delete("/supplier/delete", supplierController.deleteSupp);
  router.put("/supplier/update", supplierController.updateSupp);

  //review
  router.get("/review/:id", reviewController.getAllReview);
  router.post("/review/create", reviewController.createReview);
  return app.use("/api/v1/", router);
};

export default initWebRoutes;
