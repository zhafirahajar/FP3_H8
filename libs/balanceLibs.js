const resLibs = require("../libs/resLibs");

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

	static async addBalance(res, current, value, user) {
		let updated_balance = current + value;
		try {
			await user.update({
				balance: updated_balance,
			});
			await user.save();
		} catch (err) {
			resLibs.error(res, err);
		}
	}
}

module.exports = balanceLibs;
