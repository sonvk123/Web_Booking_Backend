const HotelModel = require("../../models/HotelModel");

exports.getHotel = async (req, res) => {
  try {
    const hotels = await HotelModel.find();

    // lấy Số lượng các khách sạn theo khu vực: Hà Nội, HCM và Đà Nẵng.
    const hotels_city = {
      HN: { image: "DaNang.jpg", count: 0 },
      HCM: { image: "HaNoi.jpg", count: 0 },
      DN: { image: "HCM.jpg", count: 0 },
    };
    hotels.map((hotel) => {
      if (hotel.city === "Ha Noi") {
        hotels_city.HN.count += 1;
      }
      if (hotel.city === "Ho Chi Minh") {
        hotels_city.HCM.count += 1;
      }
      if (hotel.city === "Da Nang") {
        hotels_city.DN.count += 1;
      }
    });

    // lấy Số lượng khách sạn theo từng loại.
    const hotels_type = [
      {
        count: 0,
        name: "Hotel",
        type: "hotel",
        image:
          "https://www.edmontondealsblog.com/wp-content/uploads/2013/05/Zen-Bedrooms.jpg",
      },
      {
        count: 0,
        name: "Apartments",
        type: "apartments",
        image:
          "https://q-xx.bstatic.com/xdata/images/hotel/263x210/119467716.jpeg?k=f3c2c6271ab71513e044e48dfde378fcd6bb80cb893e39b9b78b33a60c0131c9&o=",
      },
      {
        count: 0,
        name: "Resorts",
        type: "resorts",
        image:
          "https://q-xx.bstatic.com/xdata/images/xphoto/263x210/45450084.jpeg?k=f8c2954e867a1dd4b479909c49528531dcfb676d8fbc0d60f51d7b51bb32d1d9&o=",
      },
      {
        count: 0,
        name: "Villas",
        type: "villas",
        image:
          "https://r-xx.bstatic.com/xdata/images/hotel/263x210/100235855.jpeg?k=5b6e6cff16cfd290e953768d63ee15f633b56348238a705c45759aa3a81ba82b&o=",
      },
      {
        count: 0,
        name: "Cabins",
        type: "cabins",
        image:
          "https://q-xx.bstatic.com/xdata/images/hotel/263x210/52979454.jpeg?k=6ac6d0afd28e4ce00a8f817cc3045039e064469a3f9a88059706c0b45adf2e7d&o=",
      },
    ];

    hotels.map((hotel) => {
      hotels_type.map((hotel_type) => {
        if (hotel_type.type === hotel.type) {
          hotel_type.count += 1;
        }
      });
    });

    // lấy khách sạn rating cao
    const hotels_rating = hotels
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);


    res.status(200).send({
      message: "Lấy dữ liệu thành công",
      data: {
        hotels_city: hotels_city,
        hotels_type: hotels_type,
        hotels_rating: hotels_rating,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: "Lấy dữ liệu thất bại",
    });
  }
};
