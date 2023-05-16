const Sequelize = require('sequelize');
const sequelize = require('../db/mysql');

const User = sequelize.define('user', {

    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  module.exports = User
  