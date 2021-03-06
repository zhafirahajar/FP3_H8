const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resLibs = require("../libs/resLibs");
const userLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;

class authLibs {
	static async loginMiddleware(req, res, next) {
		try {
			let token = req.headers.token;
			let decoded = jwt.verify(token, SECRET_KEY);
			let user_instance = await userLibs.getByEmail(decoded.email);
			if (user_instance != null) {
				next();
			} else {
				resLibs.unauthorized(res);
			}
		} catch (err) {
			resLibs.error(res, err);
		}
	}

	static checkPass(req, res, data) {
		let compare = bcrypt.compareSync(req.body.password, data.password);
		let status = false;

		if (compare == true) {
			let token = jwt.sign(data.toJSON(), SECRET_KEY);
			status = true;
			return { token, status };
		} else {
			let response = resLibs.unauthorized(res);
			return { response, status };
		}
	}

	static checkUserAuth(req, res, data) {
		let token = req.headers.token,
			user_login = jwt.verify(token, SECRET_KEY),
			value = false,
			response;

		if (data == null) {
			response = resLibs.notFound(res, "Account");
			return { response, value };
		} else if (data.email != user_login.email) {
			response = resLibs.notPermitted(res);
			return { response, value };
		} else {
			response = null;
			value = true;
			return { response, value, user_login };
		}
	}

	static async checkAdmin(res, data) {
		let user = await userLibs.getByEmail(data.email),
			value = false,
			response;

		if (data == null) {
			response = resLibs.notFound(res, "Account");
			return { response, value };
		} else if (user.role != "admin") {
			response = resLibs.notAdmin(res);
			return { response, value };
		} else {
			response = null;
			value = true;
			return { response, value };
		}
	}
}
module.exports = authLibs;
