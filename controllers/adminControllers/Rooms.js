const { ObjectId } = require("mongodb");

const Hotel = require("../../models/HotelModel");
const Room = require("../../models/RoomModel");
const TransactionModel = require("../../models/TransactionModel");

// lấy danh sách Rooms
exports.getRooms = async (req, res) => {
  try {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const Rooms = await Room.find();

    // Tính toán vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = Rooms.length; // Tổng số bản ghi
    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = Rooms.slice(startIndex, endIndex);

    const data_send = {
      totalPages: totalPages,
      currentPageData: currentPageData,
    };

    res.status(200).send({ message: "thành công", data: data_send });
  } catch (err) {
    res.status(500).send({ message: "Lấy danh sách Rooms thất bại" });
  }
};

// lấy id và tên khách sạn
exports.getAddRoom = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    const data_send = [];
    hotels.map((hotel) => {
      const data = {
        id: hotel._id,
        name: hotel.name,
      };
      data_send.push(data);
    });
    res.status(200).send({ message: "lấy thành công", data: data_send });
  } catch (err) {
    res.status(500).send({ message: "Lấy id và tên khách sạn thất bại" });
  }
};

// thêm một room
exports.postAddRoom = async (req, res) => {
  try {
    const data = req.body;
    const hotelId = data.hotelName;
    const title = data.title;
    const price = data.price;
    const description = data.description;
    const maxPeople = data.maxPeople;
    const rooms = data.rooms;

    const roomsArr = rooms.split(",").map((item) => item.replace(/\s/g, ""));

    const generatedId = new ObjectId();
    const newRoom = new Room({
      _id: generatedId,
      title: title,
      desc: description,
      price: price,
      maxPeople: maxPeople,
      roomNumbers: roomsArr,
    });
    await newRoom.save();

    await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { rooms: generatedId } },
      { new: true } // Trả về bản ghi sau khi được cập nhật
    );
    res.status(200).send({ message: "Thêm room thành công", data: newRoom });
  } catch (err) {
    res.status(500).send({ message: "Thêm room thất bại" });
  }
};

// xóa một room
exports.postDeleteRoom = async (req, res) => {
  // const roomId = req.body.id;
  // const rooms = await Room.find({ _id: roomId });
  // try {
  //   const Transactions = await TransactionModel.find();
  //   let Transactions_ = [];
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

  //   // kiểm tra xem phòng có đang được sử dụgn hoặc đặt trước hay không
  //   // Sử dụng Promise.all để đợi tất cả các promise trong mảng hoàn thành
  //   await Promise.all(
  //     Transactions_.map(async (value) => {
  //       const rooms_hotel = value.room;

  //       // Sử dụng Array.prototype.some thay vì map để có thể sớm dừng lặp
  //       if (
  //         rooms_hotel.some((room) =>
  //           rooms.some((room_) => room_.roomNumbers.includes(room))
  //         )
  //       ) {
  //         test = false;
  //       }
  //     })
  //   );


  //   if (test) {
  //     // await Room.deleteOne({ _id: new ObjectId(roomId) });
  //     const hotels = await Hotel.find();
  //     let newHotel = [];
  //     hotels.map((hotel) => {
  //       if (hotel.rooms.includes(roomId)) {
  //         newHotel.push(hotel);
  //       }
  //     });

  //     for (const hotel of hotels) {
  //       const hotelId = new ObjectId(hotel._id);

  //       // Loại bỏ phòng có id là "roomId" khỏi mảng rooms
  //       const updatedRooms = hotel.rooms.filter(
  //         (roomId_) => roomId_ !== roomId
  //       );

  //       // Cập nhật đối tượng trong MongoDB
  //       await Hotel.updateOne(
  //         { _id: hotelId },
  //         {
  //           $set: {
  //             rooms: updatedRooms,
  //           },
  //         }
  //       );
  //     }

  //     res.status(200).send({ message: "xóa thàng công" });
  //   } else {
  //     res
  //     .status(401)
  //     .send({ message: "Phòng đang được sử dụng không thể xóa !!!" });
  //   }
  // } catch (err) {
  //   res.status(500).send({ message: "xóa thất bại" });
  // }
  res.status(200).send({ message: "xóa thàng công" });
};

// sửa 1 room
// lấy data room theo id
exports.getRoomId = async (req, res) => {
  try {
    const roomId = req.body.id;
    const room = await Room.find({ _id: roomId });
    res.status(200).send({ message: "Lấy hotel thàng công", data: room });
  } catch (err) {
    res.status(500).send({ message: "Lấy hotel thất bại" });
  }
};

// sửa room theo id
exports.postEditRoomId = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const { title, description, price, maxPeople, rooms } =
      req.body.data;

    const roomsArr = rooms.split("\n").filter((url) => url.trim() !== "");

    await Room.updateOne(
      { _id: roomId },
      {
        $set: {
          title: title,
          desc: description,
          price: price,
          maxPeople: maxPeople,
          roomNumbers: roomsArr,
        },
      }
    );
    res.status(200).send({ message: "Sửa room thành công !!!" });
  } catch (err) {
    res.status(500).send({ message: "Lấy room thất bại" });
  }
};
