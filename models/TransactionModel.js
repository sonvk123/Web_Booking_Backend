const mongoose = require("mongoose");

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  user: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel" }, // added reference to Hotel model
  room: [Number],
  dateStart: { type: String },
  dateEnd: { type: String },
  price: { type: Number },
  payment: { type: String },
  time: { type: String },
  status: { },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
