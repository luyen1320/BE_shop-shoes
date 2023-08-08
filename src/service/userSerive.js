import db from "../models/index";
import bcrypt from "bcryptjs";

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

const checkEmail = async (userEmail) => {
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
    let isEmailExist = await checkEmail(rawUserData.email);
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

const loginUser = () => {
  
}

module.exports = {
  // createNewUser: createNewUser,
  // getUserList: getUserList,
  // deleteUser: deleteUser,
  registerNewUser: registerNewUser,
};
