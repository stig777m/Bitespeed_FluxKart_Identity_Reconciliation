'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // define association here
    }
  }
  Contact.init({
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Contacts', 
        key: 'id'
      }
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
      defaultValue: 'primary'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Contact',
    paranoid: true, // Enable soft deletes to use the deletedAt attribute
    timestamps: true 
  });
  return Contact;
};