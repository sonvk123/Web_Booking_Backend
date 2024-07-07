const mongoose = require("mongoose");

const { Schema } = mongoose;

const HotelSchema = new Schema({
  _id: String,
  name: String,
  type: String,
  city: String,
  address: String,
  distance: String,
  photos: [String],
  desc: String,
  rating: Number,
  featured: Boolean,
  price: Number,
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }] 

});

const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports = Hotel;
