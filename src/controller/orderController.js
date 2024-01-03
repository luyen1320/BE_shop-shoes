import orderService from "../service/orderService";

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createNewOrderService(req.body);

    return res.status(200).json(order);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "LỖi",
      DT: e, //data
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const order = await orderService.addToCartService(req.body);

    return res.status(200).json(
      order //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const getProductInCart = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await orderService.getProductInCartServive(id);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const getAllOrder = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  let sortByName = req.query.sortByName;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let dashboard = req.query.dashboard;
  try {
    const data = await orderService.getAllOrderService(
      +page,
      +limit,
      sortByName,
      startDate,
      endDate,
      dashboard
    );

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: e, //data
    });
  }
};
const getAllOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await orderService.getAllOrderByUserIdService(userId);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = await orderService.updateOrder(orderId, req.body);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = await orderService.deleteOrderService(orderId);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const deleteProductInCart = async (req, res) => {
  try {
    const data = await orderService.deleteProductInCartService(req);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};

const deleteAllProductInCart = async (req, res) => {
  try {
    const data = await orderService.deleteAllProductInCartService(req);

    return res.status(200).json(
      data //data
    );
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "Lỗi",
      DT: "", //data
    });
  }
};
module.exports = {
  addToCart: addToCart,
  getProductInCart: getProductInCart,
  createOrder: createOrder,
  getAllOrder: getAllOrder,
  updateOrder: updateOrder,
  deleteProductInCart: deleteProductInCart,
  deleteAllProductInCart: deleteAllProductInCart,
  getAllOrderByUserId: getAllOrderByUserId,
  deleteOrder: deleteOrder,
};
