const SearchRepositorie = require("../../repositories/SearchRepositorie");

// tìm kiếm Hotel
exports.postSearchHotel = async (req, res) => {
  try {
    const data = req.body;
    const HotelSend = await SearchRepositorie.SearchHotel(data);
    res
      .status(200)
      .send({ message: "tìm kiếm Hotel thành công !", data: HotelSend });
  } catch (err) {
    res.status(500).send({ message: "tìm kiếm Hotel thất bại !" });
  }
};

// xem chi tiết Hotel
exports.HotelDetail = async (req, res) => {
  const hotelID = req.params.hotelID;
  try {
    const data = await SearchRepositorie.HotelDetail(hotelID);
    res.status(200).send({ message: "Đã kết nối", data: data });
  } catch (err) {
    res.status(500).send({ message: "Kết nối thất bại" });
  }
};

exports.HotelDetailRoomTime = async (req, res) => {
  const data = req.body;
  try {
    const data_done = await SearchRepositorie.HotelDetailRoomTime(data);
    res.status(200).send({ message: "Đã kết nối", data: data_done });
  } catch (err) {
    res.status(500).send({ message: "Kết nối thất bại" });
  }
};
