"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addConstraint("Users", {
			fields: ["email"],
			type: "unique",
			name: "email_value_unique_constraint",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeConstraint("Users", "email_unique_constraint");
	},
};
