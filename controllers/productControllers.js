const { Product } = require("../models");
const resLibs = require("../libs/resLibs");
const categoryLibs = require("../libs/categoryLibs");
const productLibs = require("../libs/productLibs");
const RPGen = require("../libs/balanceLibs");

class productController {
	static async create(req, res) {
		let { title, price, stock, CategoryId } = req.body;

		let category = await categoryLibs.getById(CategoryId);

		if (category == null) {
			resLibs.notFound(res, "Category");
		} else {
			Product.create({ title, price, stock, CategoryId })
				.then((data) => {
					let { id, title, stock, CategoryId, updatedAt, createdAt } = data,
						priceRP = RPGen.rupiahGenerator(data.price);

					resLibs.created(res, {
						products: {
							id,
							title,
							priceRP,
							stock,
							CategoryId,
							updatedAt,
							createdAt,
						},
					});
				})
				.catch((err) => {
					resLibs.error(res, err);
				});
		}
	}
}

module.exports = productController;
