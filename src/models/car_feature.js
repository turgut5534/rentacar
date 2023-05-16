const Sequelize = require('sequelize');
const sequelize = require('../db/mysql')

const CarFeatures = sequelize.define('CarFeatures', {});

  module.exports = CarFeatures