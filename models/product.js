"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
	class Product extends Model {
		static associate(models) {
			//relasi Product -> Category
			Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
		}
	}
	Product.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Title required",
					},
					notEmpty: {
						args: true,
						msg: "Title cannot be empty",
					},
				},
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Stock required",
					},
					notEmpty: {
						args: true,
						msg: "Stock cannot be empty",
					},
					isInt: {
						args: true,
						msg: "Stock must be integer value",
					},
					min: {
						args: [5],
						msg: "Product's stock cannot less then 5",
					},
				},
			},

			price: DataTypes.INTEGER,
			CategoryId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Product",
		}
	);
	return Product;
};
