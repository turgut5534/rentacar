const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');
const Payment = require('./payment');

const Review = sequelize.define('review', {
    title: {
      type: Sequelize.STRING
    },
    rating : {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    review: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  });

  module.exports = Review
  