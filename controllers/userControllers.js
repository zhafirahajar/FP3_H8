const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const RPGen = require("../libs/balanceLibs");
const resLibs = require("../libs/resLibs");
const userLibs = require("../libs/userLibs");
const authLibs = require("../libs/authenticationLibs");
const balanceLibs = require("../libs/balanceLibs");

class userControllers {
	static register(req, res) {
		let salt = bcrypt.genSaltSync(10),
			password = bcrypt.hashSync(req.body.password, salt),
			{ full_name, email, gender } = req.body;

		User.create({ full_name, email, password, gender })
			.then((data) => {
				let id = data.id,
					createdAt = data.createdAt,
					RPbalance = RPGen.rupiahGenerator(data.balance);
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
			let login = authLibs.checkPass(req, res, user);
			if (login.status) {
				resLibs.success(res, null, login.token, "token");
			}
		}
	}

	static async edit(req, res) {
		let user = await userLibs.getById(req.params.userId);
		let user_auth = await authLibs.checkUserAuth(req, res, user);
		let isAuthenticated = user_auth.value;

		if (isAuthenticated) {
			let isUpdated = userLibs.edit(req, res, user);
			if (isUpdated) {
				resLibs.success(res, null, { user }, "userUpdated");
			}
		}
	}

	static async delete(req, res) {
		let user = await userLibs.getById(req.params.userId);
		let user_auth = await authLibs.checkUserAuth(req, res, user);
		let isAuthenticated = user_auth.value;

		if (isAuthenticated) {
			let isDeleted = await userLibs.delete(req, res, user);
			if (isDeleted) {
				resLibs.success(res, "Your account has been successfully deleted", { user }, "deleted");
			}
		}
	}

	static async topUp(req, res) {
		let token = req.headers.token,
			user_login = jwt.verify(token, SECRET_KEY),
			user_instance = await userLibs.getById(user_login.id),
			top_up_nominal = parseInt(req.body.balance),
			isUpdated = await balanceLibs.addBalance(res, top_up_nominal, user_instance),
			balanceRP = RPGen.rupiahGenerator(isUpdated.updated_balance);

		if (isUpdated.status) {
			resLibs.success(res, balanceRP, null, "topUp");
		}
	}
}

module.exports = userControllers;
