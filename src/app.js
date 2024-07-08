const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const connect = require("./database/database");

const app = express();

const path = require("path");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

require("dotenv").config();

const urlAdmin = process.env.URL_ADMIN;
const urlClient = process.env.URL_CLIENT;

// Đặt header Access-Control-Allow-Credentials và Access-Control-Allow-Origin khi cần
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    urlAdmin,
    urlClient,
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json()); // Cho phép Express đọc dữ liệu từ JSON body

const AdminRoute = require("./routes/AdminRouter/AdminRoute");
const HotelsRouter = require("./routes/AdminRouter/HotelsRouter");
const RoomsRouter = require("./routes/AdminRouter/RoomsRouter");

const HotelRoute = require("./routes/ClientRouter/HotelRoute");
const searchRoute = require("./routes/ClientRouter/searchRoute");
const TransactionRoute = require("./routes/ClientRouter/TransactionRoute");
const LogRoute = require("./routes/ClientRouter/LogRoute");

const DATA_PATH_Image_Hotels = path.join("src", "DataHotels", "CityImage");

app.use("/images", express.static(DATA_PATH_Image_Hotels));

// Admin app
app.use("/admin", AdminRoute);

app.use("/admin", HotelsRouter);

app.use("/admin", RoomsRouter);

// Client App
// đăng ký và đăng nhập
app.use("/", LogRoute);

app.use("/", HotelRoute);

// tìm kiếm
app.use("/", searchRoute);

// Transactions
app.use("/", TransactionRoute);

app.listen(PORT ?? 5000, async (req, res) => {
  await connect();
});
