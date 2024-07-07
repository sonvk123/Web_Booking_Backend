const express = require("express");

const router = express.Router();

const TransactionController = require("../../controllers/clientControllers/TransactionController");

router.post("/saveTransaction", TransactionController.postSaveTransaction);

router.post("/getTransactions", TransactionController.getTransactions);

module.exports = router;
