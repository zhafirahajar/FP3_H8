const { User, Category } = require("../models");
const jwt = require("jsonwebtoken");

class categoryControllers{
    static create(req, res){
        let input = {
            type : req.body.type
        }
        //console.log(input)
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
            res.status(500).json({
                msg : err
            })
        }))
    }

    static index(req, res){
        console.log("masuk index")
    }

    static update(req, res){
        console.log("masuk update")
    }

    static delete(req, res){
        console.log("masuk delete")
    }
}


module.exports = categoryControllers