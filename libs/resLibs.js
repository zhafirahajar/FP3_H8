class resLibs {
	static success(res, msg = null, data = {}, desc) {
		switch (desc) {
			case "token":
				return res.status(200).json({ token: data });
			case "userUpdated":
				return res.status(200).json({
					user: {
						id: data.user.id,
						full_name: data.user.full_name,
						email: data.user.email,
						createdAt: data.user.createdAt,
						updatedAt: data.user.updatedAt,
					},
				});
			case "deleted":
				return res.status(200).json({
					message: msg,
				});
			case "topUp":
				return res.status(200).json({
					message: `Your balance has been successfully updated to ${msg}`,
				});
			case "productList":
				return res.status(200).json({
					products: data,
				});
			case "productUpdated":
				return res.status(200).json({
					products: data,
				});
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

	static notAdmin(res) {
		return res.status(403).json({ message: "You don't have permission to access this feature" });
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
		} else {
			errMessages.push(err.message);
		}

		return res.status(errCode).json({
			error: err.name,
			message: errMessages,
		});
	}

	// Response for CRUD product //

	static outOfStock(res) {
		return res.status(404).json({ message: "Product out of stock!" });
	}

	static notEnoughStock(res) {
		return res.status(404).json({ message: "Not enough stock!" });
	}

	static stockExceed5(res) {
		return res.status(400).json({ message: "Product's stock cannot less then 5" });
	}

	// ###########################

	// Response for balance user //

	static exceedLimit(res) {
		return res.status(400).json({ message: "E-money balance cannot exceed Rp. 100.000.000" });
	}

	static notEnoughBalance(res) {
		return res.status(400).json({ message: "You don't have enough balance for this transaction." });
	}

	// ###########################
}

module.exports = resLibs;
