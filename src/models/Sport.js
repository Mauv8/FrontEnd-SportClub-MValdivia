// src/models/sport.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Sport extends Model {}

Sport.init(
  {
    id: {
      type: sequelize.getDialect() === 'mysql'
        ? DataTypes.INTEGER.UNSIGNED
        : DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },

    objective: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255]
      }
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1
      },
      comment: 'Estimated class duration in minutes'
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Sport',
    tableName: 'sports',
    timestamps: true,
    underscored: true
  }
);

module.exports = Sport;