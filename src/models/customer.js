const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const Rental = require('./rental');

const Customer = sequelize.define('customer', {
    name: {
      type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    address : {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.DATE
    },
    password: {
      type: Sequelize.STRING
    }
  });

  Customer.hasMany(Rental)

  Rental.belongsTo(Customer)

  sequelize.sync()

  module.exports = Customer
  