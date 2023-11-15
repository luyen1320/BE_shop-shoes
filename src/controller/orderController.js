import orderService from "../service/orderService";

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createNewOrderService(req.body);

    return res.status(200).json(order);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "LỖi",
      DT: "", //data
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
  try {
    const data = await orderService.getAllOrderService();

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

module.exports = {
  addToCart: addToCart,
  getProductInCart: getProductInCart,
  createOrder: createOrder,
  getAllOrder: getAllOrder,
  updateOrder: updateOrder,
};
