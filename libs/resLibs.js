class resLibs {
	static success(res, msg = null, data = {}, desc) {
		switch (desc) {
			case "token":
				return res.status(200).json({ token: data });
				break;
		}
	}

	static created(res, data) {
		return res.status(201).json(data);
	}

	static unauthorized(res) {
		return res.status(401).json({ messege: "Invalid Credentials" });
	}

	static error(res, err) {
		let errCode = 500,
			errMessages = [],
			msg;

		if (err.name.includes("Sequelize")) {
			errCode = 400;
			for (let index in err.errors) {
				msg = err.errors[index].message;
				errMessages.push(msg);
			}
		} else if (err.name == "JsonWebTokenError") {
			msg = "JWT not provided";
			errMessages.push(msg);
		}

		return res.status(errCode).json({
			error: err.name,
			message: errMessages,
		});
	}
}

module.exports = resLibs;
