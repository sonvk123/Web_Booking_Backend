const express = require("express");

const router = express.Router();

const LogController = require("../../controllers/clientControllers/LogController");

router.post("/register", LogController.postRegister);

router.post("/login", LogController.getLogin);

module.exports = router;
