const { Category } = require("../models");

class categoryLibs {
	static async getById(value) {
		let categoryInstance = await Category.findOne({
			where: { id: value },
		});

		return categoryInstance;
	}
}

module.exports = categoryLibs;
