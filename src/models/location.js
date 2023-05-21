const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');

const Rental = require('./rental')
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
  Location.hasMany(Rental, { foreignKey: 'dropoff_location', as: 'dropoff' });
  Location.hasMany(Rental, { foreignKey: 'pickup_location', as: 'pickup' });

  Car.belongsTo(Location)
  Rental.belongsTo(Location, { foreignKey: 'dropoff_location', as: 'dropoff' });
  Rental.belongsTo(Location, { foreignKey: 'pickup_location', as: 'pickup' });

  module.exports = Location
  