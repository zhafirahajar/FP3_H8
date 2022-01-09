const { User } = require("../models");
const resLibs = require("../libs/resLibs");

class userLibs {
	static async getByEmail(value) {
		let userInstance = await User.findOne({
			where: { email: value },
		});

		return userInstance;
	}
}

module.exports = userLibs;
