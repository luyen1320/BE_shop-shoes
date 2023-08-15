import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

// const createNewUser = async (email, password, username) => {
//   let hashPass = hashUserPassword(password);
//   try {
//     await db.User.create({
//       username: username,
//       email: email,
//       password: hashPass,
//     });
//   } catch (error) {
//     console.log(">>> check error:", error);
//   }
// };

// const getUserList = async () => {
//   let users = [];
//   users = await db.User.findAll();

//   return users;
// };

// const deleteUser = async (userId) => {
//   await db.User.destroy({
//     where: { id: userId },
//   });
// };

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }

  return false;
};

//register
const registerNewUser = async (rawUserData) => {
  // return new Promise(async (resolve, reject) => {
  try {
    //check email are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        errCode: 1,
        errMessage: "Email đã thực sự tồn tại",
      };
    }

    //hash user password
    let hashPassword = hashUserPassword(rawUserData.password);

    //create new user
    await db.User.create({
      username: rawUserData.username,
      email: rawUserData.email,
      password: hashPassword,
    });

    return {
      errCode: 0,
      errMessage: "Tạo người dùng thành công!",
    };
  } catch (e) {
    console.log(e);
    return {
      errCode: -2,
      errMessage: "Lỗi máy chủ",
    };
    // reject(e);
  }
  // });
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: rawData.valueLogin },
          { username: rawData.valueLogin },
        ],
      },
    });

    if (user) {
      console.log(">>> found user with email/username");
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        console.log("check password");
        return {
          errCode: 0,
          errMessage: "oke!",
          DT: "", //data
        };
      }
    }

    console.log(
      ">>> Not found user with email/username: ",
      rawData.valueLogin,
      "password:",
      rawData.password
    );
    return {
      errCode: 1,
      errMessage: "Email hoặc mật khẩu không chính xác!",
      DT: "", //data
    };
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    });
  }
};

module.exports = {
  // createNewUser: createNewUser,
  // getUserList: getUserList,
  // deleteUser: deleteUser,
  registerNewUser: registerNewUser,
  handleUserLogin: handleUserLogin,
};
