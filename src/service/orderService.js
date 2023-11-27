const db = require("../models");
const { sendMailService } = require("./mailService");

const sizeMapping = {
  38: 1,
  39: 2,
  40: 3,
  41: 4,
  42: 5,
  43: 6,
  44: 7,
};

const addToCartService = async (data) => {
  try {
    if (!data) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    if (!data.userId || !data.productId || !data.sizeId || !data.quantity) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }

    const cart = await db.Cart.findOne({
      where: {
        userId: data.userId,
        productId: parseInt(data.productId),
        sizeId:
          data?.sizeId > 10
            ? sizeMapping[parseInt(data.sizeId)]
            : data.sizeId || 0,
      },
    });
    if (!cart) {
      await db.Cart.create({
        userId: data.userId,
        productId: data.productId,
        sizeId: data.sizeId,
        quantity: data.quantity,
      });
    } else {
      await cart.update(
        {
          quantity:
            parseInt(cart.quantity) === 1 && parseInt(data.quantity) === -1
              ? parseInt(cart.quantity)
              : parseInt(cart.quantity) + parseInt(data.quantity),
        },
        {
          where: {
            userId: data.userId,
            productId: data.productId,
            sizeId: sizeMapping[data.sizeId],
          },
        }
      );
    }

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getProductInCartServive = async (userId) => {
  if (!userId) {
    return {
      errCode: 1,
      errMessage: "Missing required parameter",
      DT: "",
    };
  }
  const productInCart = await db.Cart.findAll({
    where: { userId: userId },
  });

  const listProduct = [];
  for (let i = 0; i < productInCart.length; i++) {
    const product = await db.Product.findOne({
      where: { id: productInCart[i].productId },
    });
    const size = await db.Size.findOne({
      where: { id: productInCart[i].sizeId },
    });
    const newProduct = {
      id: product.id,
      productName: product.productName,
      price: product.price,
      image: product.image,
      quantity: productInCart[i].quantity,
      size: size.sizeShoes,
    };
    listProduct.push(newProduct);
  }

  return {
    errCode: 0,
    errMessage: "OK",
    DT: listProduct,
  };
};
const createNewOrderService = async (order) => {
  try {
    if (!order) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }

    const addOrder = await db.Order.create({
      username: order?.username,
      email: order?.email,
      phone: order?.phone,
      addressDetail: order?.addressDetail,
      note: order?.note || "",
      totalMoney: order?.totalMoney,
      userId: order?.userId || null,
      status: "PENDING",
      province: order?.province,
      district: order?.district,
      ward: order?.ward,
      deliveryType: order?.deliveryType,
      paymentType: order?.paymentType,
    });

    const createOrderDetailsPromises = order?.listProduct?.map((product) =>
      db.OrderDetail.create({
        orderId: addOrder.id,
        productId: product.id,
        price: product.price,
        size: product.size,
        quantity: product.quantity,
        status: "PENDING",
      })
    );

    await Promise.all(createOrderDetailsPromises);

    // Giảm số lượng sản phẩm trong bảng Product
    order?.listProduct?.forEach(async (product) => {
      const productToUpdate = await db.Inventory.findOne({
        where: {
          productId: product.id,
          sizeId: sizeMapping[product.size] || 0,
        },
      });

      if (productToUpdate) {
        // Giảm số lượng của size cụ thể
        productToUpdate.quantityInStock -= product.quantity;

        // Lưu lại thay đổi vào database
        await productToUpdate.save();
      }
    });

    //delete product in cart after create order
    const productIds = order?.listProduct?.map((product) => product.id);
    const sizeIds = order?.listProduct?.map(
      (product) => sizeMapping[product.size] || 0
    );

    await db.Cart.destroy({
      where: {
        // userId: order.userId,
        [db.Sequelize.Op.and]: [
          {
            productId: {
              [db.Sequelize.Op.in]: productIds,
            },
          },
          {
            sizeId: {
              [db.Sequelize.Op.in]: sizeIds,
            },
          },
        ],
      },
    });
    const text = `
    <p>Đơn hàng mới từ ${order?.username}</p>
    <p>Địa chỉ: ${order?.addressDetail}</p>
    <p>Số điện thoại: ${order?.phone}</p>
    <p>Tổng tiền: ${order?.totalMoney}</p>
    `;
    sendMailService(order?.email, "Đơn hàng mới", text);
    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const getAllOrderService = async () => {
  try {
    const order = await db.Order.findAll({
      include: [
        {
          model: db.OrderDetail,
          as: "orderDetail",
          attributes: ["productId", "price", "size", "quantity", "status"],
          include: [
            {
              model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
              as: "product",
              attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
            },
          ],
        },
      ],
    });
    return {
      errCode: 0,
      errMessage: "OK",
      DT: order,
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getAllOrderByUserIdService = async (userId) => {
  try {
    const order = await db.Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.OrderDetail,
          as: "orderDetail",
          attributes: ["productId", "price", "size", "quantity", "status"],
          include: [
            {
              model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
              as: "product",
              attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
            },
          ],
        },
      ],
    });
    return {
      errCode: 0,
      errMessage: "OK",
      DT: order,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const updateOrder = async (orderId, data) => {
  try {
    if (!orderId || !data) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }

    const order = await db.Order.findOne({
      where: { id: orderId },
    });

    if (!order) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy đơn hàng",
        DT: "",
      };
    }

    await db.Order.update(
      {
        status: data.status,
      },
      {
        where: { id: orderId },
      }
    );

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const deleteProductInCartService = async (req) => {
  const userId = parseInt(req.query.userId);
  const productId = parseInt(req.query.productId);
  const sizeId = parseInt(req.query.sizeId);
  try {
    if (!productId || !userId || !sizeId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    const productInCart = await db.Cart.findOne({
      where: {
        userId: userId,
        productId: productId,
        sizeId: sizeMapping[sizeId],
      },
    });

    if (!productInCart) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy sản phẩm trong giỏ hàng",
        DT: "",
      };
    }

    await db.Cart.destroy({
      where: {
        userId: userId,
        productId: productId,
        sizeId: sizeMapping[sizeId],
      },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

module.exports = {
  addToCartService,
  getProductInCartServive,
  createNewOrderService,
  getAllOrderService,
  updateOrder,
  deleteProductInCartService,
  getAllOrderByUserIdService,
};
