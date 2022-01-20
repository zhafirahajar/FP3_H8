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
		let total_balance = user.balance + value,
			status = false,
			updated_balance = user.balance,
			response;

		if (total_balance > 100000000) {
			response = resLibs.exceedLimit(res);
			return { response, updated_balance, status };
		} else {
			try {
				await user.increment("balance", { by: value });
				updated_balance = user.balance;
				status = true;
				return { updated_balance, status };
			} catch (err) {
				status = false;
				updated_balance = user.balance;
				response = resLibs.error(res, err);
				return { response, updated_balance, status };
			}
		}
	}

	static async reduceBalance(res, value, user) {
		let total_balance = user.balance - value,
			status = false,
			updated_balance = user.balance,
			response;

		if (total_balance < 0) {
			response = resLibs.notEnoughBalance(res);
			return { response, updated_balance, status };
		} else {
			try {
				await user.decrement("balance", { by: value });
				updated_balance = user.balance;
				status = true;
				return { updated_balance, status };
			} catch (err) {
				status = false;
				updated_balance = user.balance;
				response = resLibs.error(res, err);
				return { response, updated_balance, status };
			}
		}
	}
}

module.exports = balanceLibs;
