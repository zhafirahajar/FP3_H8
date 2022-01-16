const { User } = require("../models");
const resLibs = require("../libs/resLibs");

class userLibs {
	static async getByEmail(value) {
		let userInstance = await User.findOne({
			where: { email: value },
		});

		return userInstance;
	}

	static async getById(value) {
		let userInstance = await User.findOne({
			where: { id: value },
		});

		return userInstance;
	}

	static async edit(req, res, user) {
		let full_name_data =
			req.body.full_name == undefined || req.body.full_name == "" ? user.full_name : req.body.full_name;

		let email_data = req.body.email == undefined || req.body.email == "" ? user.email : req.body.email;

		try {
			await user.update({
				full_name: full_name_data,
				email: email_data,
			});

			await user.save();
			return true;
		} catch (err) {
			resLibs.err(res, err);
		}
	}

	static async delete(req, res, user) {
		try {
			await user.destroy();
			return true;
		} catch (err) {
			resLibs.error(res, err);
		}
	}
}

module.exports = userLibs;
