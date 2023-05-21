const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const Payment = require('./payment');

const Rental = sequelize.define('rental', {
    start_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_date : {
      type: Sequelize.DATE,
      allowNull: false
    },
    time : {
      type: Sequelize.STRING,
      allowNull: false
    },
    cost: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  Rental.hasMany(Payment)

  Payment.belongsTo(Rental)

  module.exports = Rental
  