const mongoose = require("mongoose");

require("dotenv").config();

const MONGODB_URI = process.env.URL_MONGODB;

const urlDatabase = MONGODB_URI;
const connect = async () => {
  try {
    let connection = await mongoose.connect(urlDatabase);
    return connection;
  } catch (err) {
    const { code } = err;
    if (code === 8000) {
      throw new Exception("sai tên đăng nhập hoặc mật khẩu !!!");
    } else if (code === "ENOTFOUIND") {
      throw new Exception("sai tên sever name !!!");
    }
    throw new Exception("lỗi gì đó rồi !!!");
  }
};

module.exports = connect;
