import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const createNewProduct = async (data) => {
  try {
    const {
      userId,
      productName,
      image,
      description,
      price,
      discount,
      supplier,
      images,
      inventory,
    } = data;

    if (!productName || !price || !inventory) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      });
    }
    const product = await db.Product.create({
      productName: productName,
      image: image,
      description: description,
      price: price,
      discount: discount,
      supplier: supplier,
      userId: userId,
    });

    // let images = [];
    // to see if files field exist

    if (images?.length > 0 && product?.id) {
      // logic to save url in db
      const createImagePromises = images?.map((image) =>
        db.Image.create({
          image: image || "",
          productId: product?.id,
        })
      );
      await Promise.all(createImagePromises);
    }

    if (inventory?.length > 0 && product?.id) {
      const createInventoryPromises = inventory?.map((inventory) =>
        db.Inventory.create({
          productId: product?.id,
          sizeId: inventory?.sizeId,
          quantityInStock: inventory?.quantityInStock,
        })
      );
      await Promise.all(createInventoryPromises);
    }
    // will assume req.body has required fields
    // here use association mixins
    // await product.addImages(images);
    // //tao san pham

    return {
      errCode: 0,
      errMessage: "OK",
      DT: data,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: e.message,
      DT: "",
    };
  }
};

const updateProductService = async (data) => {
  try {
    const { productId, images, inventory, ...productData } = data;
    if (!productId) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      });
    }
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }
    // update product
    await product.update(productData);

    if (images?.length > 0 && product) {
      // delete old images
      await db.Image.destroy({
        where: {
          productId: product.id,
        },
      });

      // logic to save url in db
      const createImagePromises = images?.map((image) =>
        db.Image.create({
          image: image || "",
          productId: product?.id,
        })
      );
      await Promise.all(createImagePromises);
    }

    if (inventory?.length > 0 && product?.id) {
      // delete old inventory
      await db.Inventory.destroy({
        where: {
          productId: product.id,
        },
      });

      const createInventoryPromises = inventory?.map((inventory) =>
        db.Inventory.create({
          productId: product?.id,
          sizeId: inventory?.sizeId,
          quantityInStock: inventory?.quantityInStock,
        })
      );
      await Promise.all(createInventoryPromises);
    }
    // will assume req.body has required fields
    // here use association mixins
    // await product.addImages(images);
    // //tao san pham

    return {
      errCode: 0,
      errMessage: "OK",
      DT: product,
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getOneProductService = async (productId) => {
  try {
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }

    let images = await db.Image.findAll({
      where: { productId: product.id },
    });

    const inventory = await db.Inventory.findAll({
      where: { productId: product.id },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: {
        ...product.dataValues,
        images: images.map((img) => img.image),
        inventory: inventory.map((inv) => ({
          sizeId: inv.sizeId,
          quantityInStock: inv.quantityInStock,
        })),
      },
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getAllProductService = async () => {
  try {
    const products = await db.Product.findAll({
      include: [
        {
          model: db.Image,
          as: "images",
          attributes: ["image"],
        },
        {
          model: db.Inventory,
          as: "inventories",
          attributes: ["sizeId", "quantityInStock"],
        },
      ],
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: products,
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};
const deleteProductService = async (productId) => {
  try {
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }

    await db.Image.destroy({
      where: {
        productId: product.id,
      },
    });

    await db.Inventory.destroy({
      where: {
        productId: product.id,
      },
    });

    await product.destroy();

    return {
      errCode: 0,
      errMessage: "OK",
      DT: product,
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

module.exports = {
  createNewProduct: createNewProduct,
  updateProductService: updateProductService,
  getOneProductService: getOneProductService,
  getAllProductService: getAllProductService,
  deleteProductService: deleteProductService,
};
