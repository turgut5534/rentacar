const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');

const Payment = sequelize.define('payment', {
    method: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount : {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    payment_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  module.exports = Payment
  