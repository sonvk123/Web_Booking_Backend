const express = require("express");

const router = express.Router();

const Hotels = require("../../controllers/adminControllers/Hotels");

// lấy dữ liệu hotels
router.get("/hotelList", Hotels.getHotels);

// thêm 1 khách sạn
router.post("/postAddHotel", Hotels.postAddHotel);

// xóa 1 khách sạn
router.post("/postDeleteHotel", Hotels.postDeleteHotel);

// sửa một khách sạn
// lấy dữ liệu khách sạn theo id
router.post("/postHotelId", Hotels.postHotelId);

// // sửa khách sạn theo id
router.post("/postEditHotelId", Hotels.postEditHotelId);

module.exports = router;
