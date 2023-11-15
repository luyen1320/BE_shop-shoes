import productService from "../service/productService";

const createProduct = async (req, res) => {
  try {
    const product = await productService.createNewProduct(req.body);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProductService(req.body);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};

const getOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.getOneProductService(productId);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProductService(productId);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await productService.getAllProductService();

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

module.exports = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  getOneProduct: getOneProduct,
  deleteProduct: deleteProduct,
  getAllProduct: getAllProduct,
};
