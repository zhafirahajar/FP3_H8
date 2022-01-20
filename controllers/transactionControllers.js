const { Category, Product, User, TransactionHistory } = require("../models");
const jwt = require("jsonwebtoken");
const authLibs = require("../libs/authenticationLibs");
const userLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;
const resLibs = require("../libs/resLibs");
const productLibs = require("../libs/productLibs");
const balanceLibs = require("../libs/balanceLibs");
const RPGen = require("../libs/balanceLibs");
const { ReadyForQueryMessage } = require("pg-protocol/dist/messages");

class transactionControllers {
	static async create(req, res) {
		// authentication
		let user_login = jwt.verify(req.headers.token, SECRET_KEY);
		let user_instance = await userLibs.getById(user_login.id);

		//get product and price
		let { productId, quantity } = req.body;
		let produk_instance = await productLibs.getById(productId);
		let hargaBeli = parseInt(quantity) * parseInt(produk_instance.price);

		// check product's stock
		let checkStock = await productLibs.checkStock(res, quantity, productId);

		if (checkStock.isStocked) {
			let reduceBalance = await balanceLibs.reduceBalance(res, hargaBeli, user_instance);

			// check user's balance
			if (reduceBalance.status == false) {
			} else {
				await productLibs.updateStock(res, parseInt(quantity), produk_instance.id);

				let input = {
					ProductId: parseInt(productId),
					UserId: user_instance.id,
					quantity: parseInt(quantity),
					total_price: hargaBeli,
				};

				TransactionHistory.create(input)
					.then((data) => {
						let totalRP = RPGen.rupiahGenerator(data.total_price);
						res.status(201).json({
							message: "you have succesfully purchase the product",
							TransactionBill: {
								total_price: totalRP,
								quantity: data.quantity,
								product_name: produk_instance.title,
							},
						});
					})
					.catch((err) => {
						let errCode = 500;
						let errMessages = [];

						for (let index in err.errors) {
							let errMsg = err.errors[index].message;
							errMessages.push(errMsg);
						}

						if (err.name.includes("Sequelize")) {
							errCode = 400;
						}
					});
			}
		}
	}

	static async index(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY);
		let user_instance = await userLibs.getById(user_login.id);

		TransactionHistory.findAll({
			where: { UserId: user_instance.id },
			attributes: { exclude: ["id"] },
			include: { model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"] },
		})
			.then((data) => {
				res.status(200).json({ transcationHistories: data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}

	static async admin(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY);
		let user = await userLibs.getById(user_login.id);
		let user_auth = await authLibs.checkUserAuth(req, res, user);
		let isAuthenticated = user_auth.value;
		let isAdmin = await authLibs.checkAdmin(res, user);

		TransactionHistory.findAll({
			attributes: { exclude: ["id"] },
			include: [
				{ model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"] },
				{ model: User, attributes: ["id", "email", "balance", "gender", "role"] },
			],
		})
			.then((data) => {
				res.status(200).json({ transcationHistories: data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}

	static async getOne(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY);
		let user = await userLibs.getById(user_login.id);
		let user_auth = await authLibs.checkUserAuth(req, res, user);
		let isAuthenticated = user_auth.value;
		let isAdmin = await authLibs.checkAdmin(res, user);

		TransactionHistory.findOne({
			where: { id: req.params.transactionsId },
			attributes: { exclude: ["id"] },
			include: { model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"] },
			plain: true,
		})
			.then((data) => {
				res.status(200).json({ data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
}

module.exports = transactionControllers;
