const UserModel = require("../../models/UserModel");

// Đăng ký User
exports.postRegister = async (req, res) => {
  try {
    const { fullName, username, password, email, phoneNumber } = req.body;
    // Kiểm tra trùng lặp
    const [existingEmail, existingUsername, existingPhoneNumber] =
      await Promise.all([
        UserModel.find({ email }),
        UserModel.find({ username }),
        UserModel.find({ phoneNumber }),
      ]);
    if (existingEmail.length > 0) {
      return res.status(401).send({ message: "Email đã được sử dụng!" });
    } else if (existingUsername.length > 0) {
      return res.status(402).send({ message: "User Name đã được sử dụng!" });
    } else if (existingPhoneNumber.length > 0) {
      return res
        .status(403)
        .send({ message: "Số điện thoại đã được sử dụng!" });
    } else {
      // Tạo mới người dùng
      const newUser = new UserModel({
        username,
        password,
        fullName,
        phoneNumber,
        email,
        isAdmin: false,
        transactions: [],
      });
      await newUser.save();
      return res
        .status(200)
        .send({ message: "Đã thêm user thành công !!!", data: newUser });
    }
  } catch (error) {
    console.error("Lỗi khi lưu người dùng:", error);
    return res
      .status(500)
      .send({ message: "Đã xảy ra lỗi khi lưu người dùng." });
  }
};
// Đăng nhập User
exports.getLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const User = await UserModel.find({
    email: email,
    password: password,
  });

  if (User.length > 0) {
    res.status(200).send({ message: "Đăng nhập thành công", data: User });
  } else {
    res
      .status(400)
      .send({ message: "tài khoản hoặc mật khẩu không chính xác !!!" });
  }
};
