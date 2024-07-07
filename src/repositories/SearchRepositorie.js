const HotelModel = require("../models/HotelModel");
const RoomModel = require("../models/RoomModel");
const TransactionModel = require("../models/TransactionModel");

// tìm kiếm Hotel
exports.SearchHotel = async (data) => {
  const input_City = data.destination;
  const startDate = data.date.startDate;
  const endDate = data.date.endDate;
  const input_room = data.options.room;

  let HotelsList; // HotelsList theo địa chỉ
  try {
    // lấy dữ liệu HotelsList theo city nếu có nhập hoặc không
    if (input_City) {
      HotelsList = await HotelModel.find({ city: input_City });
    } else {
      HotelsList = await HotelModel.find();
    }
    // lấy dữ liệu phòng từ mảng id đã có ở trên
    let hotelsListRooms = [];
    HotelsList.map((hotel) => {
      const data = {
        id: hotel._id,
        name: hotel.name,
        rooms: hotel.rooms,
      };
      hotelsListRooms.push(data);
    });

    // lấy id phòng từ danh sách HotelsList ở trên
    let hotelsListRoom = [];
    for (const hotel of HotelsList) {
      const roomNumbers = [];

      for (const roomId of hotel.rooms) {
        const room = await RoomModel.findOne({ _id: roomId });
        if (room) {
          roomNumbers.push(...room.roomNumbers);
        }
      }

      const data = {
        id: hotel._id,
        name: hotel.name,
        rooms: hotel.rooms,
        roomNumbers: roomNumbers,
      };

      hotelsListRoom.push(data);
    }

    // danh sách phòng đã lọc trùng nhau
    hotelsListRoom.map((value) => {
      value.roomNumbers = [...new Set(value.roomNumbers.flat())];
    });


    // lấy và kiểm tra xem đã có Transaction nào chưa
    const Transactions = await TransactionModel.find();

    // danh sách trains có date trùng với ngày được chọn
    let = availableTransactions = [];
    if (Transactions.length === 0) {
      return HotelsList;
    } else if (Transactions.length > 0) {
      // bắt đầu của search bé hơn hết thúc của Transactions hoặc kết thúc của search bé hơn bắt đầu của Transactions
      Transactions.map((transaction) => {
        const roomStartDate = new Date(transaction.dateStart).getTime();
        const roomEndDate = new Date(transaction.dateEnd).getTime();

        // Kiểm tra xem phòng có sẵn trong thời gian yêu cầu không
        if (
          roomEndDate < new Date(startDate).getTime() ||
          roomStartDate > new Date(endDate).getTime()
        ) {
          return;
        } else if (
          roomEndDate >= new Date(startDate).getTime() ||
          roomStartDate <= new Date(endDate).getTime() ||
          (roomStartDate <= new Date(startDate).getTime() &&
            new Date(endDate).getTime() <= roomEndDate)
        ) {
          availableTransactions.push(transaction);
        }
      });
      // lấy id hotle từ danh sách results ở trên
      let hotelsListId = [];
      availableTransactions.map((result) => {
        if (result.hotel && result.hotel._id) {
          const data = {
            id: result.hotel._id.toString(),
            roomNumbers: result.room,
          };
          hotelsListId.push(data);
        }
      });

      // Sử dụng Set để theo dõi id và roomNumbers duy nhất
      const resultMap = hotelsListId.reduce((result, current) => {
        const existingObject = result[current.id];

        if (existingObject) {
          // Nếu đã có đối tượng với cùng id, cập nhật danh sách roomNumbers
          existingObject.roomNumbers = Array.from(
            new Set([...existingObject.roomNumbers, ...current.roomNumbers])
          );
        } else {
          // Nếu chưa có, thêm đối tượng mới vào result
          result[current.id] = {
            id: current.id,
            roomNumbers: [...new Set(current.roomNumbers)],
          };
        }

        return result;
      }, {});

      const newHotelsListId = Object.values(resultMap);


      // lọc xem khách sạn còn phòng trống theo ngày không
      hotelsListRoom.map((hotel) => {
        newHotelsListId.map((value) => {
          if (hotel.id === value.id) {
            const result = hotel.roomNumbers.filter(
              (element) => !value.roomNumbers.includes(element)
            );
            hotel.roomNumbers = result;
          }
        });
      });


      // nếu số phòng còn lại của khách sạn lớn hơn số phòng cần đặy thì trả về khách sạn đó
      const roomNumbers = hotelsListRoom.filter((value) => {
        return value.roomNumbers.length > input_room;
      });

        "lấy nếu số phòng còn lạicủa khách sạn lớn hơn số phòng cần đặy thì trả về khách sạn đó thành công"

      const hotelIds = roomNumbers.map((hotel) => hotel.id);

      const HotelsListSend = await HotelModel.find({
        _id: { $in: hotelIds },
      });

      return HotelsListSend;
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

// xem chi tiết Hotel
exports.HotelDetail = async (hotelID) => {
  const Hotel = await HotelModel.find({ _id: hotelID });
  const Rooms = await RoomModel.find({ _id: { $in: Hotel[0].rooms } });
  const data = { Hotel, Rooms };
  return data;
};

// tìm kiếm phòng theo thời gian
exports.HotelDetailRoomTime = async (data) => {
  const { hotelId, rooms, date } = data;
  const { startDate, endDate } = date;

  const transactions = await TransactionModel.find();

  // phòng đang được sử dụng

  let newTransactions; // danh sách trains theo hotelId
  if (transactions) {
    newTransactions = transactions.filter((transaction) => {
      let data = String(transaction.hotel).toString();
      return data === hotelId;
    });


    // danh sách trains có date trùng với ngày được chọn
    let = availableTransactions = [];
    newTransactions.map((transaction) => {
      const roomStartDate = new Date(transaction.dateStart).getTime();
      const roomEndDate = new Date(transaction.dateEnd).getTime();

      // Kiểm tra xem phòng có sẵn trong thời gian yêu cầu không
      if (
        roomEndDate < new Date(startDate).getTime() ||
        roomStartDate > new Date(endDate).getTime()
      ) {
        return;
      } else if (
        roomEndDate >= new Date(startDate).getTime() ||
        roomStartDate <= new Date(endDate).getTime() ||
        (roomStartDate <= new Date(startDate).getTime() &&
          new Date(endDate).getTime() <= roomEndDate)
      ) {
        availableTransactions.push(transaction);
      }
    });
    // lấy danh sách số phòng trống
    const usedRooms = availableTransactions
      .map((transaction) => transaction.room)
      .flat();
    const uniqueUsedRooms = [...new Set(usedRooms)];

    rooms.forEach((room) => {
      room.roomNumbers = room.roomNumbers.filter(
        (value) => !uniqueUsedRooms.includes(value)
      );
    });

    return rooms;
  } else {
    return rooms;
  }
};
