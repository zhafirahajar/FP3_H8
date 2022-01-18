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

			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Price required",
					},
					notEmpty: {
						args: true,
						msg: "Price cannot be empty",
					},
					isInt: {
						args: true,
						msg: "Price must be integer value",
					},
					min: {
						args: [0],
						msg: "Product's price cannot less then Rp. 0",
					},
					max: {
						args: [50000000],
						msg: "Product's price cannot more then Rp. 50.000.000",
					},
				},
			},

			CategoryId: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "Product",
		}
	);
	return Product;
};
