const res = require("express/lib/response");

class resLibs {
	static resCreated(res, code, data) {
		return res.status(code).json(data);
	}

	static resError(res, code, err) {
		let errCode = 500,
			errMessages = [];

		if (err.name.includes("Sequelize")) {
			errCode = 400;
		}

		for (let index in err.errors) {
			let msg = err.errors[index].message;
			errMessages.push(msg);
		}

		return res.status(errCode).json({
			error: err.name,
			message: errMessages,
		});
	}
}

module.exports = resLibs;
