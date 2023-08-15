import userService from "../service/userSerive";

// const handleCreateNewUser = async (req, res) => {
//   let message = await userService.createNewUser(req.body);
//   console.log(message);
//   return res.status(200).json(message);
// };

const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(200).json({
        errCode: "1",
        errMessage: "Thiếu tham số bắt buộc",
        DT: "", //data
      });
    }

    if (req.body.password && req.body.password.length < 4) {
      return res.status(200).json({
        errCode: "1",
        errMessage: "Mật khẩu phải nhiều hơn 4 kí tự",
        DT: "", //data
      });
    }
    console.log(">>> call me:", req.body);

    let data = await userService.registerNewUser(req.body);

    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: "", //data
    });
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    let data = await userService.handleUserLogin(req.body);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    });
  }
};

module.exports = {
  // handleCreateNewUser: handleCreateNewUser,
  handleRegister: handleRegister,
  handleLogin: handleLogin,
};
