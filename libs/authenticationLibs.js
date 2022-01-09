const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resLibs = require("../libs/resLibs");
const { SECRET_KEY } = process.env;

class authLibs {
	static loginMiddleware() {}
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
