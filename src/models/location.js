const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const Car = require('./car');

const Location = sequelize.define('location', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address : {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  Location.hasMany(Car)

  Car.belongsTo(Location)

  module.exports = Location
  