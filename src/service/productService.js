import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const createNewProduct = async (data) => {
  try {
    const { productName, image, description, price, discount, supplier } =
      req.body;

    let images = [];
    // to see if files field exist
    if (req.files) {
      // logic to save url in db
      for (let i = 0; i < req.files.length; i++) {
        let image = await db.Image.create(req.files[i]);
        images.push(image);
      }
    }
    // will assume req.body has required fields
    // const product = await Product.create(req.body);
    // here use association mixins
    await product.addImages(images);
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
