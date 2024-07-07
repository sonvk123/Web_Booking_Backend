const express = require("express");

const router = express.Router();

const searchController = require('../../controllers/clientControllers/searchController')

router.post('/search' , searchController.postSearchHotel);

router.get('/search/:hotelID' , searchController.HotelDetail);

router.post('/search/RoomsTime' , searchController.HotelDetailRoomTime);

module.exports = router