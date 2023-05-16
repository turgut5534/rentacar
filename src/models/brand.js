const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');

const Brand = sequelize.define('brand', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
  });

  module.exports = Brand
  