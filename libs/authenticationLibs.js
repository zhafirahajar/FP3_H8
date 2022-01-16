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
		if (compare == true) {
			let token = jwt.sign(data.toJSON(), SECRET_KEY);
			return token;
		} else {
			resLibs.unauthorized(res);
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
			return { response, value };
		}
	}
}
module.exports = authLibs;
