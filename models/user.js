"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		static associate(models) {
			// define association here
		}
	}
	user.init(
		{
			full_name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Full name required",
					},
					notEmpty: {
						args: true,
						msg: "Full name cannot be empty",
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: {
						args: true,
						msg: "Invalid email format",
					},
					notNull: {
						msg: "Email required",
					},
					notEmpty: {
						args: true,
						msg: "Email cannot be empty",
					},
				},
				unique: {
					args: true,
					msg: "Email already registered, use another email",
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Password required",
					},
					notEmpty: {
						args: true,
						msg: "Password cannot be empty",
					},
				},
			},
			gender: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Gender required",
					},
					notEmpty: {
						args: true,
						msg: "Gender cannot be empty",
					},
					isIn: {
						args: [["male", "female"]],
						msg: "Gender invalid",
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Role required",
					},
					notEmpty: {
						args: true,
						msg: "Role cannot be empty",
					},
					isIn: {
						args: [["admin", "customer"]],
						msg: "Role invalid",
					},
				},
			},
			balance: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Balance required",
					},
					notEmpty: {
						args: true,
						msg: "Balance cannot be empty",
					},
					min: {
						args: 0,
						msg: "Balance cannot less then Rp. 0,.",
					},
					max: {
						args: 100000000,
						msg: "Balance cannot more than Rp. 100.000.000,.",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "user",
		}
	);
	return user;
};
