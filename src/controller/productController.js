import productService from "../service/productService";

const createProduct = async (req, res) => {
  try {
    const product = await productService.createNewProduct(req.body);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};
