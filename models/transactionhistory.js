'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi TransactionHistory -> Product 
      TransactionHistory.belongsTo(models.Product, {foreignKey : "ProductId"})
      //relasi TransactionHistory -> Users 
      TransactionHistory.belongsTo(models.User, {foreignKey : "Userid"})
    }
  };
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Quantity required",
        },
        notEmpty: {
          args: true,
          msg: "Quantity cannot be empty",
        },
        isInt: {
          msg : "Quantity Must Be an Integer / Numbers"
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total price required",
        },
        notEmpty: {
          args: true,
          msg: "Total price cannot be empty",
        },
        isInt: {
          msg : "Total Price Must Be an Integer / Numbers"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};