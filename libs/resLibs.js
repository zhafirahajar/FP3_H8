class resLibs {
	static success(res, msg = null, data = {}, desc) {
		switch (desc) {
			case "token":
				return res.status(200).json({ token: data });
				break;
			case "updated":
				return res.status(200).json({
					user: {
						id: data.user.id,
						full_name: data.user.full_name,
						email: data.user.email,
						createdAt: data.user.createdAt,
						updatedAt: data.user.updatedAt,
					},
				});
				break;
		}
	}

	static created(res, data) {
		return res.status(201).json(data);
	}

	static unauthorized(res) {
		return res.status(401).json({ messege: "Invalid Credentials" });
	}

	static notFound(res, msg) {
		return res.status(404).json({ message: `${msg} not found` });
	}

	static notPermitted(res) {
		return res.status(401).json({ message: "You don't have permission on this user" });
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
