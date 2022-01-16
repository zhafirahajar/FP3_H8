const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RPGen = require("../libs/balanceLibs");
const resLibs = require("../libs/resLibs");
const userLibs = require("../libs/userLibs");
const authLibs = require("../libs/authenticationLibs");

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
				resLibs.created(res, { user: { id, full_name, email, gender, balance: RPbalance, createdAt } });
			})
			.catch((err) => {
				resLibs.error(res, err);
			});
	}

	static async login(req, res) {
		let user = await userLibs.getByEmail(req.body.email);

		if (user == null) {
			resLibs.unauthorized(res);
		} else {
			let token = authLibs.checkPass(req, res, user);
			resLibs.success(res, null, token, "token");
		}
	}

	static async edit(req, res) {
		let user = await userLibs.getById(req.params.userId);
		let user_auth = await authLibs.checkUserAuth(req, res, user);
		let isAuthenticated = user_auth.value;

		if (isAuthenticated) {
			userLibs.edit();
		}
	}
}

module.exports = userControllers;
