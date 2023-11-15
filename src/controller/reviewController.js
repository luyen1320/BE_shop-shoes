const db = require("../models");
let reviewController = {
  getAllReview: async (productId, res) => {
    try {
      let data = await db.Review.findAll({
        where: { productId: productId },
        include: [
          // {
          //   model: db.User,
          //   as: "user",
          //   attributes: ["firstName", "lastName", "avatar"],
          // },
          {
            model: db.Product,
            as: "product",
            attributes: ["name"],
          },
        ],
        attributes: {
          exclude: ["userId", "productId"],
        },
        where: {
          status: "active",
        },
      });
      if (data) {
        return res.status(200).json({
          errCode: 0,
          data: data,
        });
      }
      return res.status(500).json({
        errCode: 1,
        errMessage: "Lỗi hệ thống",
      });
    } catch (e) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Lỗi hệ thống",
      });
    }
  },

  createReview: async (req, res) => {
    try {
      let { productId, content, star } = req.body;
      if (!productId || !content || !star) {
        return res.status(500).json({
          errCode: 1,
          errMessage: "Thiếu thông tin",
        });
      }
      console.log(req.body);
      let data = await db.Review.create({
        userId: req.body.userId || 0,
        productId: parseInt(productId),
        content: content,
        star: star,
      });
      if (data) {
        return res.status(200).json({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Lỗi hệ thống",
        error: e,
      });
    }
  },
};

module.exports = reviewController;
