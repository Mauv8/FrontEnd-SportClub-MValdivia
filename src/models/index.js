const sequelize = require('../config/database');
const User = require('./User');
const Sport = require('./Sport');

const db = {
  sequelize,
  User,
  Sport
};

module.exports = db;
