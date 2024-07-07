const express = require("express");

const router = express.Router();

const HotelController = require("../../controllers/clientControllers/HotelController");
const RoomController = require("../../controllers/clientControllers/RoomController");

router.get("/", HotelController.getHotel);

router.get("/rooms", RoomController.getRooms);

// router.get();

// router.get();

// router.get();

module.exports = router;
