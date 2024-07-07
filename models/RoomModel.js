const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoomSchema = new Schema({
  _id : String,
  title: String,
  desc: String,
  price: Number,
  maxPeople: Number,
  roomNumbers: [Number],
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
