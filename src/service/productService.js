import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const createNewProduct = async (data) => {
  try {
    const { productName, image, description, price, discount, supplier } =
      req.body;

    //tao san pham
    const product = await db.Product.create({
      productName: data.productName,
      image: data.image,
      description: data.description,
      price: data.price,
      discount: data.discount,
    });
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getAllProducts = () => {};

module.exports = {
  createNewProduct: createNewProduct,
};
