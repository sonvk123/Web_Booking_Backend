const express = require("express");

const router = express.Router();

const AdminController = require("../../controllers/adminControllers/AdminController");

// thêm nhiều khách sạn
router.post('/addHotels' , AdminController.postHotels);

// thêm nhiều rooms
router.post('/addRooms' , AdminController.postRooms)

// tạo User Admin
router.post('/postAddUserAdmin' , AdminController.postAddUserAdmin)

// đăng nhâp admin
router.post('/postAdminLogin' , AdminController.postAdminLogin)

// lấy dữ liệu Transactions
router.get('/getTransactions' , AdminController.getTransactions)

// lấy dữ liệu Transactions All
router.get('/getTransactionsAll' , AdminController.getTransactionsAll)


module.exports = router;
