const { Category, Product } = require("../models");
const jwt = require("jsonwebtoken");
const authLibs = require("../libs/authenticationLibs");
const userLibs = require("../libs/userLibs");
const { SECRET_KEY } = process.env;
const resLibs = require("../libs/resLibs");

class categoryControllers{
    static async create(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)

        let input = {
            type : req.body.type
        }
        Category.create(input)
        .then((data) =>{
            res.status(201).json({
                id : data.id,
                type: data.type,
                updatedAt : data.updatedAt,
                createdAt: data.createdAt,
                sold_product_amount : data.sold_product_amount
            })
        })
        .catch(((err) => {
            let errCode = 500;
            let errMessages = [];

            for (let index in err.errors) {
                    let errMsg = err.errors[index].message;
                    errMessages.push(errMsg);
            }

            if (err.name.includes("Sequelize")) {
                    errCode = 400;
            }

            res.status(errCode).json({
                    error: err.name,
                    message: errMessages,
            });
}))
    }

    static async index(req, res){

        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)

        
        Category.findAll({
            include : Product
        })
        .then((data) => {
            res.status(200).json({
                "categories" : data
            })
        })
        .catch((err)=>{
            let errCode = 500;
            let errMessages = [];
            for (let index in err.errors) {
                    let errMsg = err.errors[index].message;
                    errMessages.push(errMsg);
            }
            if (err.name.includes("Sequelize")) {
                    errCode = 400;
            }
            res.status(errCode).json({
                    error: err.name,
                    message: errMessages,
            });

        })
    }

    //saat type tidak di kirim dia tidak error
    static async update(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)

        let category_instance = await Category.findOne({
            where : {
                id : req.params.categoryId
            }
        })
        console.log(category_instance)

        if (category_instance === null){
            res.status(404).json({msg : "Category does not exists"})
        }

        category_instance.update({
            type : req.body.type
        })
        .then( data => {
            res.status(200).json(
                {
                    "Category" : data
                }
            )
        })
        .catch(err => {
            res.status(500).json({msg : err})
        })
    }

    static async delete(req, res){
        let user_login = jwt.verify(req.headers.token, SECRET_KEY)
        let user = await userLibs.getById(user_login.id)
        let user_auth = await authLibs.checkUserAuth(req, res, user);
        let isAuthenticated = user_auth.value;
        let isAdmin = await authLibs.checkAdmin(res, user)

       let category_instance = await Category.findOne({
          where: {
              id : req.params.categoryId
          }
      })
      if(category_instance === null){
            res.status(404).json({msg : "Category does not exists"})
      }else{
          category_instance
          .destroy()
          .then(data=>{
              res.status(200).json({
                "msg" : "Category has been successfuly deleted"
              })
          })
          .catch(err => {
            res.status(500).json(err);
          })
      }

    }
}


module.exports = categoryControllers