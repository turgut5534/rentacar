const moment = require('moment');

const carStatus = (start_date, end_date, is_delivered) => {
  const today = moment().startOf('day'); // Set the time to the beginning of the day

  if (is_delivered) {
    return "Delivered";
  } else {
    const startDate = moment(start_date).startOf('day'); // Set the time of start_date to the beginning of the day
    const endDate = moment(end_date).startOf('day'); // Set the time of end_date to the beginning of the day

    if (startDate.isAfter(today)) {
      return "The car is waiting to be delivered to you";
    } else if (endDate.isBefore(today)) {
      return "Reservation completed but not delivered";
    } else if (startDate.isSame(endDate)) {
      return "Invalid reservation: Start and end dates are the same";
    } else {
      return "Ongoing reservation";
    }
  }
};

module.exports = carStatus;
