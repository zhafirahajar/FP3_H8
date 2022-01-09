const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resLibs = require("../libs/resLibs");
const RPGen = require("../libs/balanceLibs");

class userControllers {
	static register(req, res) {
		let salt = bcrypt.genSaltSync(10),
			password = bcrypt.hashSync(req.body.password, salt),
			role = "customer",
			balance = 0,
			{ full_name, email, gender } = req.body;

		User.create({ full_name, email, password, gender, role, balance })
			.then((data) => {
				let id = data.id,
					createdAt = data.createdAt,
					RPbalance = RPGen.rupiahGenerator(balance);
				resLibs.resCreated(res, 201, { user: { id, full_name, email, gender, balance: RPbalance, createdAt } });
			})
			.catch((err) => {
				resLibs.resError(res, 500, err);
			});
	}

	static login(req, res) {}
}

module.exports = userControllers;
