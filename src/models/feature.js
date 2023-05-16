const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const CarFeatures = require('./car_feature');

const Feature = sequelize.define('feature', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  Feature.hasMany(CarFeatures)

  CarFeatures.belongsTo(Feature)

  module.exports = Feature
  