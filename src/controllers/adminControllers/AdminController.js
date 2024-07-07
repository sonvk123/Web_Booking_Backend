const fs = require("fs");

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const Hotel = require("../../models/HotelModel");
const Room = require("../../models/RoomModel");
const UserModel = require("../../models/UserModel");
const TransactionModel = require("../../models/TransactionModel");

const DATA_PATH_Hotle = "../../DataHotels/hotels.json";
const DATA_PATH_Room = "../../DataHotels/rooms.json";

const data_Hotles = JSON.parse(fs.readFileSync(DATA_PATH_Hotle, "utf8"));
const data_Rooms = JSON.parse(fs.readFileSync(DATA_PATH_Room, "utf8"));

// thêm Hotels vào trong database
exports.postHotels = (req, res) => {
  let data_Hotles_all = [];
  data_Hotles.map((value) => {
    const Hotel = {
      _id: value._id.$oid || value._id,
      name: value.name,
      type: value.type,
      city: value.city,
      address: value.address,
      distance: value.distance,
      photos: value.photos,
      desc: value.desc,
      rating: value.rating,
      featured: value.featured,
      price: value.cheapestPrice,
      rooms: value.rooms.map((id) => new ObjectId(id)),
    };
    data_Hotles_all.push(Hotel);
  });
  console.log(data_Hotles_all);
  Hotel.insertMany(data_Hotles_all)
    .then((result) => res.status(200).json("Đã chèn thành công"))
    .catch((error) => {
      console.error("Lỗi khi chèn", error);
      res.status(500).json("Lỗi khi chèn");
    });
};

// thêm Rooms vào trong database
exports.postRooms = (req, res) => {
  let data_Rooms_all = [];
  data_Rooms.map((value) => {
    const room = {
      _id: value._id.$oid || value._id,
      title: value.title,
      desc: value.desc,
      price: value.price,
      maxPeople: value.maxPeople,
      roomNumbers: value.roomNumbers,
    };
    data_Rooms_all.push(room);
  });
  Room.insertMany(data_Rooms_all)
    .then((result) =>
      res.status(200).send({ message: "Đã chèn thành công", data: result })
    )
    .catch((error) => {
      console.error("Lỗi khi chèn", error);
      res.status(500).json("Lỗi khi chèn");
    });
};

// thêm user Admin
exports.postAddUserAdmin = async (req, res) => {
  try {
    const fullName = req.body.fullName;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const isAdmin = true;
    const newUser = new UserModel({
      username: username,
      password: password,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      isAdmin: isAdmin,
    });
    // Lưu thông tin mới vào database
    await newUser.save();
    res
      .status(200)
      .send({ message: "Đã thêm user thành công !!!", data: newUser });
  } catch (error) {
    console.error("Lỗi khi lưu người dùng:", error);
    res.status(500).send({ message: "Đã xảy ra lỗi khi lưu người dùng." });
  }
};

// đăng nhập admin
exports.postAdminLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const User = await UserModel.find({
    email: email,
    password: password,
    isAdmin: true,
  });

  if (User.length === 0) {
    res.status(400).send({ message: "Sai tài khoản hoặc mật khẩu" });
    return;
  } else {
    const userSend = {
      _id: User[0]._id,
      username: User[0].username,
      email: User[0].email,
      isAdmin: User[0].isAdmin,
    };
    res.status(200).send({ message: "Đăng nhập thành công", data: userSend });
  }
};

// lấy danh sách Dashboard
exports.getTransactions = async (req, res) => {
  let Transactions_0_8;
  try {
    const Transactions_hotels = await TransactionModel.find().populate("hotel");
    //   "adminController-117-Transactions_hotels : ",
    //   Transactions_hotels
    // );
    let newTransactions_hotels = [];
    if (Transactions_hotels.length > 0) {
      for (let value of Transactions_hotels) {
        const name = value.hotel.name;
        // Sử dụng toObject() để chuyển đối tượng mongoose thành đối tượng JavaScript thông thường.
        const newValue = { ...value.toObject(), hotel: name };
        newTransactions_hotels.push(newValue);
      }
      // sắp xếp theo thời gian sớm nhất đến muộn nhất
      newTransactions_hotels.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      Transactions_0_8 = newTransactions_hotels.slice(0, 8);
      Transactions_0_8.forEach((value) => {
        // lấy ngày tháng năm hiện tại
        const create_date = () => {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
          const day = currentDate.getDate() - 1;
          return `${year}-${month < 10 ? "0" : ""}${month}-${
            day < 10 ? "0" : ""
          }${day}T17:00:00.000Z`;
        };
        // ngày tháng năm hiện tại và trong các giao dịch
        const newDate = new Date(create_date());
        const roomStartDate = new Date(value.dateStart);
        const roomEndDate = new Date(value.dateEnd);

        if (roomStartDate <= newDate && newDate <= roomEndDate) {
          value.status = "Checkin";
        } else if (newDate < roomStartDate) {
          value.status = "Booking";
        } else if (roomEndDate < newDate) {
          value.status = "Checkout";
        }
      });
    } else {
      newTransactions_hotels = [];
      Transactions_0_8 = [];
    }

    // số lượng Users
    const Users = await UserModel.find({ isAdmin: false });
    const countUsers = Users.length;
    // số lượng đơn
    const Transactions = await TransactionModel.find();
    const countTransactions = Transactions.length;
    // tổng doanh thu
    let totelPrice = 0;
    Transactions.map((value) => {
      totelPrice += value.price;
    });

    // doanh thu trung bình hàng tháng
    let blance = 0;
    if (newTransactions_hotels.length > 0) {
      // Transaction cũ nhất
      const newTransactions_hotels_startDate =
        newTransactions_hotels.length - 1;

      const startDate = new Date(
        newTransactions_hotels[newTransactions_hotels_startDate].time
      );
      // Transaction mới nhất
      const endDate = new Date(newTransactions_hotels[0].time);

      // Sử dụng đối tượng Date để lấy thông tin về năm và tháng từ các ngày
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();

      // Tính số tháng trong khoảng thời gian
      const numberOfMonths =
        (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

      blance = totelPrice / numberOfMonths;
    } else {
      blance = 0;
    }

    const data_send = {
      user: countUsers,
      order: countTransactions,
      rarnings: totelPrice,
      blance: blance,
      data: Transactions_0_8,
    };
    res
      .status(200)
      .send({ message: "Lấy danh sách thành công", data: data_send });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

// lấy danh sách Transactions
exports.getTransactionsAll = async (req, res) => {
  const pageSize = req.query.pageSize;
  const currentPage = req.query.currentPage;
  try {
    const Transactios = await TransactionModel.find().populate("hotel");

    let newTransactions = [];
    Transactios.map((value) => {
      const name = value.hotel.name;
      // Sử dụng toObject() để chuyển đối tượng mongoose thành đối tượng JavaScript thông thường.
      const newValue = { ...value.toObject(), hotel: name };
      newTransactions.push(newValue);
    });

    newTransactions.forEach((value) => {
      const create_date = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
        const day = currentDate.getDate() - 1;
        return `${year}-${month < 10 ? "0" : ""}${month}-${
          day < 10 ? "0" : ""
        }${day}T17:00:00.000Z`;
      };
      const newDate = new Date(create_date());
      const roomStartDate = new Date(value.dateStart);
      const roomEndDate = new Date(value.dateEnd);

      if (roomStartDate <= newDate && newDate <= roomEndDate) {
        value.status = "Checkin";
      } else if (newDate < roomStartDate) {
        value.status = "Booking";
      } else if (roomEndDate < newDate) {
        value.status = "Checkout";
      }
    });

    // Tính toán vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = newTransactions.length; // Tổng số bản ghi
    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = newTransactions.slice(startIndex, endIndex);

    const data_send = {
      totalPages: totalPages,
      currentPageData: currentPageData,
    };

    res.status(200).send({ message: "thành công", data: data_send });
  } catch (err) {
    res.status(500).send({ message: "thất bại" });
  }
};
