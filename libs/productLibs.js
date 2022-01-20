const { Product } = require("../models");
const resLibs = require("../libs/resLibs");
const categoryLibs = require("../libs/categoryLibs");

class productLibs {
	static async getById(productId) {
		let productInstance = await Product.findOne({
			where: { id: productId },
		});
		return productInstance;
	}

	static async getAll() {
		let product = Product.findAll().then().catch();
		return product;
	}

	static async update(req, res, productId) {
		let productInstance = await this.getById(productId),
			isUpdated = false,
			response;

		if (productInstance == null) {
			response = resLibs.notFound(res, "Product");
			return { response, isUpdated };
		} else {
			let price_data =
				req.body.price == undefined || req.body.price == "" ? productInstance.price : req.body.price;

			let stock_data =
				req.body.stock == undefined || req.body.stock == "" ? productInstance.stock : req.body.stock;

			let title_data =
				req.body.title == undefined || req.body.title == "" ? productInstance.title : req.body.title;

			await productInstance.update({
				price: price_data,
				stock: stock_data,
				title: title_data,
			});

			await productInstance.save();

			isUpdated = true;

			return { isUpdated };
		}
	}

	static async updateCategory(req, res, productId) {
		let productInstance = await this.getById(productId),
			isUpdated = false,
			response;

		if (productInstance == null) {
			response = resLibs.notFound(res, "Product");
			return { response, isUpdated };
		} else {
			let category_data =
				req.body.CategoryId == undefined || req.body.CategoryId == ""
					? productInstance.CategoryId
					: req.body.CategoryId;

			let category = await categoryLibs.getById(category_data);

			if (category == null) {
				response = resLibs.notFound(res, "Category");
				return { response, isUpdated };
			} else {
				if (category == null) {
					response = resLibs.notFound(res, "Category");
					return { response, isUpdated };
				} else {
					await productInstance.update({
						CategoryId: category_data,
					});

					await productInstance.save();

					isUpdated = true;

					return { isUpdated };
				}
			}
		}
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
