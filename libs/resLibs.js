const res = require("express/lib/response");

class resLibs {
	static resCreated(res, code, data) {
		return res.status(code).json(data);
	}

	static resError(res, code, err) {
		return res.status(code).json(err);
	}
}

module.exports = resLibs;
