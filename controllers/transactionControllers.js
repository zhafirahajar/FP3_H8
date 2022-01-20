const { Category, Product, User, TransactionHistory } = require("../models");
const jwt = require("jsonwebtoken");
const authLibs = require("../libs/authenticationLibs");
const userLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;
const resLibs = require("../libs/resLibs");
const productLibs = require("../libs/productLibs");
const balanceLibs = require("../libs/balanceLibs");
const RPGen = require("../libs/balanceLibs");

class transactionControllers{
    static async create(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user_instance = await userLibs.getById(user_login.id);
        let { produkId, quantity} = req.body;
        let produk_instance = await productLibs.getById(produkId)
        let checkStock = await productLibs.checkStock(res, quantity, produkId)
        //pada saat pengecekan user balance ketika user sudah login dengan balance 0, lalu topup apakah data balance yang di bawa hasil top up apa masih 0
        //harus di handle non intger
        let hargaBeli = parseInt(quantity) * parseInt(produk_instance.price)
        let checkBalance = user_instance.balance - hargaBeli

        
        if(checkBalance < 0 ){
            res.status(403).json({msg : "Not enough balance!"})
        }else{

            /*
                - kurangi balance
                - tambah product terjual di kategory
                - kurangi stok barang
            */
            let reduceBalance = await balanceLibs.addBalance(res, hargaBeli, user_instance)
            console.log("laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",reduceBalance)
            
            let input = {
                ProductId : parseInt(produkId),
                UserId : user_instance.id,
                quantity : parseInt(quantity),
                total_price : hargaBeli
            }

            TransactionHistory.create(input)
            .then((data) => {
                res.status(201).json({
                    message : "you have succesfully purchase the product",
                    TransactionBill : {
                        total_price : data.total_price,
                        quantity : data.quantity,
                        product_name : produk_instance.title
                    }
                })
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
            })
        } 
    }

    static async index(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user_instance = await userLibs.getById(user_login.id);
     
        TransactionHistory.findAll({
            where : {UserId : user_instance.id},
            attributes : {exclude : ["id"]},
            include : {model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"]}
        })
        .then((data)=>{
            res.status(200).json({"transcationHistories" : data})
        })
        .catch((err)=>{
            res.status(500).json(err)
        })
        
    }

    static async admin(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)
    
        TransactionHistory.findAll({
            attributes : {exclude : ["id"]},
            include : [
                {model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"]},
                {model: User, attributes: ["id", "email", "balance", "gender", "role"]}
            ]
        })
        .then((data)=>{
            res.status(200).json({"transcationHistories" : data})
        })
        .catch((err)=>{
            res.status(500).json(err)
        })
        
    }

    static async getOne(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)
     
        TransactionHistory.findOne({
            where : {id : req.params.transactionsId},
            attributes : {exclude : ["id"]},
            include : {model: Product, attributes: ["id", "title", "price", "stock", "CategoryId"]},
            plain : true
        })
        .then((data)=>{
            res.status(200).json({data})
        })
        .catch((err)=>{
            res.status(500).json(err)
        })
        
    }

}


module.exports = transactionControllers