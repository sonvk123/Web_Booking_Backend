const express = require("express");

const router = express.Router();

const Rooms = require("../../controllers/adminControllers/Rooms");

// thêm 1 room
// lấy danh sách các khách sạn
router.get("/roomsList", Rooms.getRooms);

// lấy id và tên khách sạn
router.get("/getAddRoom", Rooms.getAddRoom);

// thêm room
router.post("/postAddRoom", Rooms.postAddRoom);

// xóa 1 room
router.post("/postDeleteRoom", Rooms.postDeleteRoom);

// sửa 1 room
// lấy data room theo id
router.post("/getRoomId", Rooms.getRoomId);

// sửa room theo id
router.post("/postEditRoomId", Rooms.postEditRoomId);

module.exports = router;
