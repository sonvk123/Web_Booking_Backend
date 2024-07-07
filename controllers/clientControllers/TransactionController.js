const TransactionModel = require("../../models/TransactionModel");

const UserModel = require("../../models/UserModel");

// thêm Save Transaction
exports.postSaveTransaction = async (req, res) => {
  const date = { dateStart: req.body.dateStart, dateEnd: req.body.dateEnd };
  try {
    const newTransaction = new TransactionModel({
      user: req.body.userId,
      hotel: req.body.hotelID,
      room: req.body.room,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      price: req.body.price,
      payment: req.body.payment,
      time: new Date(),
      status: date,
    });

    await newTransaction.save();
    const User = await UserModel.findById(req.body.userId);
    User.transactions.push(newTransaction);
    await User.save();
    res.status(200).send({ message: " thành công", data: newTransaction });
  } catch (err) {
    res.status(500).send({ message: "thất bại" });
  }
};

// lấy dữ liệu Transaction
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.body.userId;

    const Transactions_hotels = await TransactionModel.find({
      user: userId,
    }).populate("hotel");

    let newTransactions_hotels = [];
    Transactions_hotels.map((value) => {
      const name = value.hotel.name;
      // Sử dụng toObject() để chuyển đối tượng mongoose thành đối tượng JavaScript thông thường.
      const newValue = { ...value.toObject(), hotel: name };
      newTransactions_hotels.push(newValue);
    });

    newTransactions_hotels.forEach((value) => {
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

    res
      .status(200)
      .send({ message: "Thành công", data: newTransactions_hotels });
  } catch (err) {
    res.status(500).send({ message: "Thất bại" });
  }
};
