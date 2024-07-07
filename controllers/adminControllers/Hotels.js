const { ObjectId } = require("mongodb");

const Hotel = require("../../models/HotelModel");
const TransactionModel = require("../../models/TransactionModel");

// lấy danh sách hotels
exports.getHotels = async (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  const Hotels = await Hotel.find();

  // Tính toán vị trí đầu và cuối của trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalRecords = Hotels.length; // Tổng số bản ghi
  const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

  // Lấy dữ liệu cho trang hiện tại
  const currentPageData = Hotels.slice(startIndex, endIndex);

  const data_send = {
    totalPages: totalPages,
    currentPageData: currentPageData,
  };
  res.status(200).send({ message: "thành công", data: data_send });
};

// thêm một khách sạn
exports.postAddHotel = async (req, res) => {
  const {
    name,
    type,
    city,
    address,
    distance,
    title,
    description,
    price,
    featuredOption,
    images,
  } = req.body;

  const imagesArr = images.split("\n").map((item) => item.replace(/\s/g, ""));

  try {
    const generatedId = new ObjectId();
    const newHotel = new Hotel({
      _id: generatedId,
      name: name,
      type: type,
      city: city,
      address: address,
      distance: distance,
      photos: imagesArr,
      desc: description,
      price,
      featured: featuredOption,
      rating: 5,
    });
    await newHotel.save();
    res.status(200).send({ message: "thêm thàng công", data: newHotel });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "thêm thất bại" });
  }
};

// xóa một khách sạn
exports.postDeleteHotel = async (req, res) => {
  // try {
  //   const hotelId = req.body.id;
  //   let Transactions_ = [];
  //   const Transactions = await TransactionModel.find();
  //   Transactions.forEach((value) => {
  //     // lấy ngày tháng năm hiện tại
  //     const create_date = () => {
  //       const currentDate = new Date();
  //       const year = currentDate.getFullYear();
  //       const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  //       const day = currentDate.getDate() - 1;
  //       return `${year}-${month < 10 ? "0" : ""}${month}-${
  //         day < 10 ? "0" : ""
  //       }${day}T17:00:00.000Z`;
  //     };
  //     // ngày tháng năm hiện tại và trong các giao dịch
  //     const newDate = new Date(create_date());
  //     const roomStartDate = new Date(value.dateStart);
  //     const roomEndDate = new Date(value.dateEnd);

  //     if (roomStartDate <= newDate && newDate <= roomEndDate) {
  //       Transactions_.push(value);
  //     } else if (newDate < roomStartDate) {
  //       Transactions_.push(value);
  //     }
  //   });
  //   let test = true;

  //   Transactions_.map((value) => {
  //     if (value.hotel.toString() === hotelId) {
  //       test = false;
  //     }
  //   });
  //   if (test) {
  //     await Hotel.deleteOne({ _id: new ObjectId(hotelId) });
  //     res.status(200).send({ message: "xóa thàng công" });
  //   } else {
  //     res
  //       .status(401)
  //       .send({ message: "Khách sạn đang được sử dụng không thể xóa !!!" });
  //   }
  // } catch (err) {
  //   res.status(500).send({ message: "xóa thất bại" });
  // }
  res.status(200).send({ message: "xóa thàng công" });
};

// sửa 1 khách sạn
// lấy dữ liệu khách sạn theo id
exports.postHotelId = async (req, res) => {
  try {
    const hotelId = req.body.id;
    const hotel = await Hotel.find({ _id: hotelId });
    res.status(200).send({ message: "Lấy hotel thàng công", data: hotel });
  } catch (err) {
    res.status(500).send({ message: "Lấy hotel thất bại" });
  }
};

// // sửa khách sạn theo id
exports.postEditHotelId = async (req, res) => {
  try {
    const hotelId = req.body.hotelId;
    const {
      name,
      type,
      city,
      address,
      distance,
      title,
      description,
      price,
      rooms,
      images,
      featured,
    } = req.body.data;

    const roomsArr = rooms.split("\n").filter((url) => url.trim() !== "");
    const imagesArr = images.split("\n").filter((url) => url.trim() !== "");

    await Hotel.updateOne(
      { _id: hotelId },
      {
        $set: {
          name: name,
          type: type,
          city: city,
          address: address,
          distance: distance,
          photos: imagesArr,
          desc: description,
          featured: featured,
          price: price,
          rooms: roomsArr,
        },
      }
    );
    res.status(200).send({ message: "Sửa hotel thành công !!!" });
  } catch (err) {
    res.status(500).send({ message: "Lấy hotel thất bại" });
  }
};
