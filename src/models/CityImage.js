const mongoose = require("mongoose");

const { Schema } = mongoose;

const ImageSchema = new Schema({
  type: String,
  properties: Number,
  data: String,
  contentType: String,
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
