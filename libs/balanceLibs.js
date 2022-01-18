const resLibs = require("../libs/resLibs");
const { User } = require("../models");

class balanceLibs {
	static rupiahGenerator(value) {
		let formater = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "IDR",
			}),
			raw = formater.format(value),
			length = raw.toString().length,
			final = raw
				.replace("IDR", "Rp")
				.replace(/,/g, ".")
				.substring(0, length - 4);

		return final;
	}

	static async addBalance(res, value, user) {
		try {
			await user.increment("balance", { by: value });
			return user.balance;
		} catch (err) {
			resLibs.error(res, err);
		}
	}

	static async reduceBalance(res, value, user) {
		try {
			await user.deccrement("balance", { by: value });
			return user.balance;
		} catch (err) {
			resLibs.error(res, err);
		}
	}
}

module.exports = balanceLibs;
