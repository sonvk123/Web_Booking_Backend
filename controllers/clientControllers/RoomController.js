const HotelModel = require("../../models/HotelModel");
const RoomModel = require("../../models/RoomModel");

exports.getRooms = async (req, res) => {
  await RoomModel.find({})
    .then((Rooms) => {
      res.status(200).send({
        message: "Lấy dữ liệu thành công",
        data: Rooms,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Lấy dữ liệu thất bại",
      });
    });
};
