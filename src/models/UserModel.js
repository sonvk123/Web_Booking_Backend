const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String,
  fullName: String,
  phoneNumber: String,
  email: String,
  isAdmin: Boolean,
  transactions: [
    { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
