const { Category, Product, User, TransactionHistory } = require("../models");
const jwt = require("jsonwebtoken");
const authLibs = require("../libs/authenticationLibs");
const userLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;
const resLibs = require("../libs/resLibs");
const productLibs = require("../libs/productLibs");
const balanceLibs = require("../libs/balanceLibs");
const RPGen = require("../libs/balanceLibs");
const categoryLibs = require("../libs/categoryLibs");
const transcationsLibs = require("../libs/transactionsLibs")


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

		//add sold

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
					.then( async (data) => {
						let totalRP = RPGen.rupiahGenerator(data.total_price);
						let addSoldProduct = await categoryLibs.addSoldProduct(res, quantity, produk_instance.CategoryId)
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
						res.status(500).json(err)
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
			data.map(x => {
				x.total_price = RPGen.rupiahGenerator(x.total_price)
				x.Product.price = RPGen.rupiahGenerator(x.Product.price)
			})
				res.status(200).json({ transcationHistories: data});
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
				data.map(x => {
					x.total_price = RPGen.rupiahGenerator(x.total_price)
					x.Product.price = RPGen.rupiahGenerator(x.Product.price)
				})
				res.status(200).json({ transcationHistories: data });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}

	static async getOne(req, res) {
		let user_login = jwt.verify(req.headers.token, SECRET_KEY);
		let user_instance = await userLibs.getById(user_login.id);
		let transaction_instance = await transcationsLibs.getById(parseInt(req.params.transactionsId))
		if(user_instance.role != "admin" && transaction_instance.UserId != user_instance.id){
			res.status(403).json({"message" : "You dont have permision"})
		}
		TransactionHistory.findOne({
			where: { id: req.params.transactionsId },
			attributes: { exclude: ["id"] },
			include: { model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"] },
		})
			.then((data) => {
				res.status(200).json({ 
					ProductId : data.ProductId,
					UserId: data.UserId,
					quantity: data.quantity,
					total_price: RPGen.rupiahGenerator(data.total_price),
					createdAt : data.createdAt,
					updatedAt: data.updatedAt,
					Product:{
						id: data.Product.id,
						title : data.Product.title,
						price: RPGen.rupiahGenerator(data.Product.price),
						stock: data.Product.stock,
						CategoryId: data.Product.CategoryId
					}

				 });
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
}

module.exports = transactionControllers;
