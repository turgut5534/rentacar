const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const CarFeatures = require('./car_feature');
const Rental = require('./rental');
const Review = require('./review');
const Brand = require('./brand');

const Car = sequelize.define('car', {
    image: {
      type: Sequelize.STRING
    },
    model: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    year: {
      type: Sequelize.STRING,
      allowNull: false
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false
    },
    plate: {
      type: Sequelize.STRING
    },
    transmission: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mileage: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    seat: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fuel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lugguage: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  Car.hasMany(CarFeatures)
  Car.hasMany(Rental)
  Car.hasMany(Review)
  Brand.hasMany(Car)

  CarFeatures.belongsTo(Car)
  Rental.belongsTo(Car)
  Review.belongsTo(Car)
  Car.belongsTo(Brand)

  module.exports = Car
  