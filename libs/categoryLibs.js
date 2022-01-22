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
		//console.log(category)
		try {
			await category.increment("sold_product_amount", { by: value });
		} catch (err) {
			return err
		}
	}
}

module.exports = categoryLibs;
