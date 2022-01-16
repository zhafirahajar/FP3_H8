const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resLibs = require("../libs/resLibs");
const useLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;

class authLibs {
	static loginMiddleware(req, res, next) {
		try {
			let token = req.headers.token;
			let decoded = jwt.verify(token, SECRET_KEY);
			let user_instance = userLibs.getByEmail(decoded.email);
			if (user_instance != null) {
				next;
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
}
module.exports = authLibs;
