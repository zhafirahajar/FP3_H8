const { Product } = require("../models");
const resLibs = require("../libs/resLibs");

class productLibs {
	static async getById(productId) {
		let productInstance = await Product.findOne({
			where: { id: productId },
		});
		return productInstance;
	}

	static async checkStock(res, value, productId) {
		let productInstance = await this.getById(productId),
			isStocked = false,
			stock,
			response;

		if (productInstance == null) {
			response = resLibs.notFound(res, "Product");
			return { response, isStocked };
		} else {
			stock = productInstance.stock;
			if (stock == 0) {
				response = resLibs.outOfStock(res);
				return { response, isStocked };
			} else if (value > stock) {
				response = resLibs.notEnoughStock(res);
			} else {
				response = null;
				isStocked = true;
				return { response, isStocked };
			}
		}
	}

	static async updateStock(res, value, productId) {
		let productInstance = await this.getById(productId),
			updated_stock;

		if (productInstance == null) {
			resLibs.notFound(res, "Product");
		} else {
			updated_stock = productInstance.stock - value;
			try {
				await productInstance.update({
					stock: updated_stock,
				});
				await productInstance.save();
			} catch (err) {
				resLibs.error(res, err);
			}
		}
	}
}

module.exports = productLibs;
