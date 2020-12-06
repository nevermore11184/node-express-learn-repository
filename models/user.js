/** sequelize */
const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

/** belongs to many PRODUCTS / ORDERS or only 1 single CART */
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
