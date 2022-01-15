'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi Category -> Product 
      Category.hasMany(models.Product, {foreignKey : "CategoryId"})
    }
  };
  Category.init({
    type: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull: {
          msg: "Type Category required",
        },
        notEmpty: {
          args: true,
          msg: "Type Category cannot be empty",
        },
      }
    },
    sold_product_amount: {
      type : DataTypes.INTEGER,
      allowNull: false,
      defaultValue : 0,
      validate : {
        notNull: {
          msg: "Product Amount required",
        },
        notEmpty: {
          args: true,
          msg: "Product Amount cannot be empty",
        },
        isInt: {
          msg : "Product Amount Must Be an Integer / Numbers"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};