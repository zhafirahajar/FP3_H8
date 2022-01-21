const { TransactionHistory } = require("../models");

class transcationsLibs {
	static async getById(value) {
		let transcationsInstance = await TransactionHistory.findOne({
			where: { id: value },
		});

		return transcationsInstance;
	}
}

module.exports = transcationsLibs;
