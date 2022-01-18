"use strict";
const bcrypt = require("bcrypt");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		let salt = bcrypt.genSaltSync(10);
		let hash = bcrypt.hashSync('12345', salt);
		let data = 
			[
				{
					full_name: "admin",
					email: "admin@gmail.com",
					password: hash,
          gender: "male",
          role : "admin",
          balance: 0,
					createdAt: new Date(),
					updatedAt: new Date()
				}	
		]
		await queryInterface.bulkInsert("Users", data);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Users", null, {});
	},
};




