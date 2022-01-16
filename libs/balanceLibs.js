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
}

module.exports = balanceLibs;
