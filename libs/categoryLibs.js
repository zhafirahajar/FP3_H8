const { Category } = require("../models");

class categoryLibs {
	static async getById(value) {
		let categoryInstance = await Category.findOne({
			where: { id: value },
		});

		return categoryInstance;
	}

	static async addSoldProduct(res, value, categoryId) {
			let category = await this.getById(categoryId)

			try {
				await category.increment("sold_product_amount", { by: value });
				let status = true;
				return { updated_balance, status };
			} catch (err) {
				let status = false;
				updated_balance = user.balance;
				response = resLibs.error(res, err);
				return { response, updated_balance, status };
			}
	}
}

module.exports = categoryLibs;
