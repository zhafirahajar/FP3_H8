const { Product } = require("../models");
const resLibs = require("../libs/resLibs");
const categoryLibs = require("../libs/categoryLibs");
const productLibs = require("../libs/productLibs");
const RPGen = require("../libs/balanceLibs");
const authLibs = require("../libs/authenticationLibs");
const userLibs = require("../libs/userLibs");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

class productController {
	static async create(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY),
			user = await userLibs.getById(user_login.id),
			isAdmin = await authLibs.checkAdmin(res, user);
		if (isAdmin.value) {
			let { title, price, stock, CategoryId } = req.body,
				category = await categoryLibs.getById(CategoryId);

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
								price: priceRP,
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

	static async index(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY),
			user = await userLibs.getById(user_login.id),
			isAdmin = await authLibs.checkAdmin(res, user);
		if (isAdmin.value) {
			let product = await productLibs.getAll();
			resLibs.success(res, null, product, "productList");
		}
	}

	static async update(req, res) {
		let productId = req.params.productId;

		let user_login = jwt.verify(req.headers.token, SECRET_KEY),
			user = await userLibs.getById(user_login.id),
			isAdmin = await authLibs.checkAdmin(res, user);
		if (isAdmin.value) {
			let isUpdated = await productLibs.update(req, res, productId);
			if (isUpdated.isUpdated) {
				let product = await productLibs.getById(productId);
				resLibs.success(res, null, product, "productUpdated");
			}
		}
	}

	static async changeCategory(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY),
			user = await userLibs.getById(user_login.id),
			isAdmin = await authLibs.checkAdmin(res, user);
		if (isAdmin.value) {
			let isUpdated = await productLibs.updateCategory(req, res, req.params.productId);
			if (isUpdated.isUpdated) {
				let product = await productLibs.getById(req.params.productId);
				resLibs.success(res, null, product, "productUpdated");
			}
		}
	}

	static async delete(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY),
			user = await userLibs.getById(user_login.id),
			isAdmin = await authLibs.checkAdmin(res, user);
		if (isAdmin.value) {
			let isDeleted = await productLibs.deleteProduct(res, req.params.productId);
			if (isDeleted) {
				resLibs.success(res, "Product has been successfully deleted", null, "deleted");
			}
		}
	}
}

module.exports = productController;
